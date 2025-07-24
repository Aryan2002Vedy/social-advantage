import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { NgChartsModule } from 'ng2-charts';
import {
  ChartOptions,
  ChartData,
  ChartTypeRegistry
} from 'chart.js';

type PieChartType = keyof Pick<ChartTypeRegistry, 'pie'>;
type BarChartType = keyof Pick<ChartTypeRegistry, 'bar'>;
type PieChartOptions = ChartOptions<'pie'>;
type BarChartOptions = ChartOptions<'bar'>;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private firestore = inject(FirestoreService);
  private auth = inject(Auth);
  private router = inject(Router);

  // 👉 Pie Chart
  public pieChartType: PieChartType = 'pie';
  public pieChartOptions: PieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Leads by Interest',
        color: 'cyan'
      }
    }
  };
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Meta Ads', 'CRM Integration', 'Landing Page'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
      hoverOffset: 10
    }]
  };

  // 👉 Bar Chart
  public barChartType: BarChartType = 'bar';
  public barChartOptions: BarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Monthly Leads',
        color: 'cyan'
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };
  public barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{
      label: 'Leads per Month',
      data: [],
      backgroundColor: '#42A5F5'
    }]
  };

  leads: any[] = [];
  filteredLeads: any[] = [];
  selectedInterest: string = '';
  startDate: string = '';
  endDate: string = '';

  // Pagination
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  itemsPerPage = 5;

  ngOnInit() {
    this.firestore.getLeads().subscribe((leads: any[]) => {
      this.leads = leads;
      this.applyFilter();
    });
  }

  applyFilter() {
    let filtered = this.leads;

    if (this.selectedInterest) {
      filtered = filtered.filter(lead => lead.interest === this.selectedInterest);
    }

    filtered = filtered.filter(lead => {
      const leadDate = new Date(lead.date);
      if (this.startDate) {
        const start = new Date(this.startDate);
        if (leadDate < start) return false;
      }
      if (this.endDate) {
        const end = new Date(this.endDate);
        end.setHours(23, 59, 59, 999);
        if (leadDate > end) return false;
      }
      return true;
    });

    this.filteredLeads = filtered;
    this.updateChartData();
    this.updateBarChartData();
  }

  updateChartData() {
    const counts = { meta: 0, crm: 0, landing: 0 };
    this.filteredLeads.forEach(lead => {
      const interest = lead.interest?.toLowerCase();
      if (interest in counts) {
        counts[interest as keyof typeof counts]++;
      }
    });

    this.pieChartData.datasets[0].data = [
      counts.meta,
      counts.crm,
      counts.landing
    ];
    this.pieChartData = { ...this.pieChartData };
  }

  updateBarChartData() {
  const counts: { [month: string]: number } = {};
  const now = new Date();

  // Prepare last 6 months keys like "Jul 2025", "Jun 2025"...
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i);
    const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    counts[key] = 0;
  }

  this.filteredLeads.forEach(lead => {
    const date = new Date(lead.date);
    const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (counts[key] !== undefined) {
      counts[key]++;
    }
  });

  this.barChartData.labels = Object.keys(counts);
  this.barChartData.datasets[0].data = Object.values(counts);

  // Trigger chart refresh
  this.barChartData = { ...this.barChartData };
}

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredLeads.sort((a, b) => {
      const aVal = a[column]?.toString().toLowerCase() || '';
      const bVal = b[column]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    this.currentPage = 1;
  }

  paginatedLeads(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLeads.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLeads.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  exportToPDF() {
    if (this.filteredLeads.length === 0) {
      alert('No leads to export!');
      return;
    }

    const doc = new jsPDF();
    const columns = ['Name', 'Phone', 'Interest', 'Message', 'Date'];
    const rows = this.filteredLeads.map(lead => [
      lead.name,
      lead.phone,
      lead.interest,
      lead.message || '',
      new Date(lead.date).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [0, 188, 212],
        textColor: 255,
        halign: 'center',
      },
    });

    doc.save(`leads-${Date.now()}.pdf`);
  }

  exportToCSV() {
    if (this.filteredLeads.length === 0) {
      alert('No leads to export!');
      return;
    }

    const csvData = Papa.unparse(
      this.filteredLeads.map(lead => ({
        Name: lead.name,
        Phone: lead.phone,
        Interest: lead.interest,
        Message: lead.message,
        Date: new Date(lead.date).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }))
    );

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  logout() {
    signOut(this.auth).then(() => this.router.navigate(['/login']));
  }
}
