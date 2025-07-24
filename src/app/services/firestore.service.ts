import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  addLead(data: any) {
    const leadsRef = collection(this.firestore, 'leads');
    return addDoc(leadsRef, data);
  }
    getLeads(): Observable<any[]> {
    const leadsRef = collection(this.firestore, 'leads');
    return collectionData(leadsRef, { idField: 'id' }) as Observable<any[]>;
  }
}
