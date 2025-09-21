import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './config';

// Collections
export const COLLECTIONS = {
  CUSTOMERS: 'customers',
  APPOINTMENTS: 'appointments',
  CONSULTATIONS: 'consultations',
  REPORTS: 'reports'
};

// Generic Firestore operations
export class FirestoreService {
  // Get all documents from a collection
  static async getAll(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document
  static async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  // Add a new document
  static async add(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  static async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error(`Error updating ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName, id) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      console.error(`Error deleting ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  // Query with conditions
  static async query(collectionName, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      conditions.forEach(condition => {
        q = query(q, condition);
      });

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  // Real-time listener
  static onSnapshot(collectionName, callback, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      conditions.forEach(condition => {
        q = query(q, condition);
      });

      return onSnapshot(q, (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(docs);
      });
    } catch (error) {
      console.error(`Error setting up listener for ${collectionName}:`, error);
      throw error;
    }
  }
}

// Specific service functions for each collection
export const customerService = {
  getAll: () => FirestoreService.getAll(COLLECTIONS.CUSTOMERS),
  getById: (id) => FirestoreService.getById(COLLECTIONS.CUSTOMERS, id),
  add: (customer) => FirestoreService.add(COLLECTIONS.CUSTOMERS, customer),
  update: (id, customer) => FirestoreService.update(COLLECTIONS.CUSTOMERS, id, customer),
  delete: (id) => FirestoreService.delete(COLLECTIONS.CUSTOMERS, id),
  getActive: () => FirestoreService.query(COLLECTIONS.CUSTOMERS, [where('status', '==', 'active')]),
  onSnapshot: (callback) => FirestoreService.onSnapshot(COLLECTIONS.CUSTOMERS, callback)
};

export const appointmentService = {
  getAll: () => FirestoreService.getAll(COLLECTIONS.APPOINTMENTS),
  getById: (id) => FirestoreService.getById(COLLECTIONS.APPOINTMENTS, id),
  add: (appointment) => FirestoreService.add(COLLECTIONS.APPOINTMENTS, appointment),
  update: (id, appointment) => FirestoreService.update(COLLECTIONS.APPOINTMENTS, id, appointment),
  delete: (id) => FirestoreService.delete(COLLECTIONS.APPOINTMENTS, id),
  getByDate: (date) => FirestoreService.query(COLLECTIONS.APPOINTMENTS, [where('date', '==', date)]),
  onSnapshot: (callback) => FirestoreService.onSnapshot(COLLECTIONS.APPOINTMENTS, callback)
};

export const consultationService = {
  getAll: () => FirestoreService.getAll(COLLECTIONS.CONSULTATIONS),
  getById: (id) => FirestoreService.getById(COLLECTIONS.CONSULTATIONS, id),
  add: (consultation) => FirestoreService.add(COLLECTIONS.CONSULTATIONS, consultation),
  update: (id, consultation) => FirestoreService.update(COLLECTIONS.CONSULTATIONS, id, consultation),
  delete: (id) => FirestoreService.delete(COLLECTIONS.CONSULTATIONS, id),
  getByCustomer: (customerId) => FirestoreService.query(COLLECTIONS.CONSULTATIONS, [where('customerId', '==', customerId)]),
  onSnapshot: (callback) => FirestoreService.onSnapshot(COLLECTIONS.CONSULTATIONS, callback)
};
