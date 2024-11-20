import { inject, Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import {
  Auth,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { update } from '@angular/fire/database';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  where,
  query,
} from '@angular/fire/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  StringFormat,
  uploadBytes,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public isAuthenticated: boolean = false;
  public usuarioLogueado: any = null;

  nivel: string = '';

  private storage: FirebaseStorage;

  usuarioPersistente: User | null = null;

  constructor(
    @Inject(Auth) private auth: Auth,
    @Inject(Firestore) private firestore: Firestore
  ) {
    this.storage = getStorage();
  }

  async registerPaciente(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    edad: number,
    dni: string,
    obraSocial: string,
    imagenesPerfil: File,
    imagenesPerfil2: File,
    nivel: string
  ) {
    const userCredencial = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const user = userCredencial.user;

    await sendEmailVerification(user);

    const storageRef = ref(this.storage, `Pacientes/${user.uid}/perfil.jpg`);
    await uploadBytes(storageRef, imagenesPerfil);
    const imagenUrl = await getDownloadURL(storageRef);

    const storageRef2 = ref(this.storage, `Pacientes/${user.uid}/perfil.jpg`);
    await uploadBytes(storageRef2, imagenesPerfil2);
    const imagenUrl2 = await getDownloadURL(storageRef2);

    await setDoc(doc(this.firestore, 'Pacientes', user.uid), {
      uid: user.uid,
      email: user.email,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      obraSocial: obraSocial,
      imagenesPerfil: imagenUrl,
      segundaImagenPerfil: imagenUrl2,
      nivel: nivel,
      isHabilitado: true,
    });

    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerEspecialista(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    edad: number,
    dni: string,
    especialidades: string[],
    imagenesPerfil: File,
    nivel: string
  ) {
    const userCredencial = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const user = userCredencial.user;

    await sendEmailVerification(user);

    const storageRef = ref(
      this.storage,
      `Especialistas/${user.uid}/perfil.jpg`
    );
    await uploadBytes(storageRef, imagenesPerfil);
    const imagenUrl = await getDownloadURL(storageRef);

    await setDoc(doc(this.firestore, 'Especialistas', user.uid), {
      uid: user.uid,
      email: user.email,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      especialidades: especialidades,
      imagenesPerfil: imagenUrl,
      nivel: nivel,
      isHabilitado: false,
    });

    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerAdmin(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    edad: number,
    dni: string,
    imagenesPerfil: File,
    imagenesPerfil2: File,
    nivel: string
  ) {
    const userCredencial = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const user = userCredencial.user;

    await sendEmailVerification(user);

    const storageRef = ref(
      this.storage,
      `Administrador/${user.uid}/perfil.jpg`
    );
    await uploadBytes(storageRef, imagenesPerfil);
    const imagenUrl = await getDownloadURL(storageRef);

    const storageRef2 = ref(
      this.storage,
      `Administrador/${user.uid}/perfil.jpg`
    );
    await uploadBytes(storageRef2, imagenesPerfil2);
    const imagenUrl2 = await getDownloadURL(storageRef2);

    await setDoc(doc(this.firestore, 'Administrador', user.uid), {
      uid: user.uid,
      email: user.email,
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      dni: dni,
      imagenesPerfil: imagenUrl,
      imagenesPerfil2: imagenUrl2,
      nivel: nivel,
      isHabilitado: true,
    });

    //return signInWithEmailAndPassword(this.auth, email, password);
  }

  async getEspecialistas() {
    const especialistasRef = collection(this.firestore, 'Especialistas');
    const especialistasSnapshot = await getDocs(especialistasRef);

    return especialistasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getPacientes() {
    const pacientesRef = collection(this.firestore, 'Pacientes');
    const pacientesSnapshot = await getDocs(pacientesRef);

    return pacientesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getAdmin() {
    const administradoresRef = collection(this.firestore, 'Administrador');
    const administradoresSnapshot = await getDocs(administradoresRef);

    return administradoresSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async HabilitacionCuentas(usuario: any) {
    const userDocRef = doc(this.firestore, 'Especialistas', usuario.uid);
    try {
      await updateDoc(userDocRef, {
        isHabilitado: !usuario.isHabilitado, // Cambia el estado habilitado/inhabilitado
      });
      usuario.isHabilitado = !usuario.isHabilitado; // Actualiza el estado localmente para reflejar el cambio en la UI
      console.log(
        `Usuario ${
          usuario.isHabilitado ? 'habilitado' : 'inhabilitado'
        } correctamente.`
      );
    } catch (error) {
      console.error('Error al cambiar el estado de habilitación: ', error);
    }
  }

  async login(email: string, password: string) {
    const userCredencial = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredencial.user;

    if (!user.emailVerified) {
      throw new Error(
        'Por favor, verifique su correo antes de iniciar sesion brother.'
      );
    }

    return user;
  }

  async verificarNivelUsuario(user: any) {
    let userData = await this.traerUsuarioPorRol(user.uid, 'Administrador');
    if (userData) {
      console.log('Usuario es Administrador');
      return 'Administrador';
    }

    userData = await this.traerUsuarioPorRol(user.uid, 'Especialistas');
    if (userData) {
      console.log('Usuario es Especialista');
      return 'Especialista';
    }

    userData = await this.traerUsuarioPorRol(user.uid, 'Pacientes');
    if (userData) {
      console.log('Usuario es Paciente');
      return 'Paciente';
    }

    console.log('No se encontro el usuario en ninguna coleccion');
    return (this.nivel = '');
  }

  async traerUsuarioPedido(user: any) {
    let userData = await this.traerUsuarioPorRol(user.uid, 'Administrador');
    if (userData) {
      console.log('Usuario es Administrador');
      return userData;
    }

    userData = await this.traerUsuarioPorRol(user.uid, 'Especialistas');
    if (userData) {
      console.log('Usuario es Especialista');
      return userData;
    }

    userData = await this.traerUsuarioPorRol(user.uid, 'Pacientes');
    if (userData) {
      console.log('Usuario es Paciente');
      return userData;
    }

    console.log('No se encontro el usuario en ninguna coleccion');
    return userData;
  }

  async traerUsuarioPorRol(uid: string, rol: string) {
    const userDocRef = doc(this.firestore, rol, uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.log(`No se encontro el usuario en la coleccion ${rol}`);
    }

    return null;
  }

  async agregarCampoExtraEspecialista(
    uid: string,
    campo: string,
    valor: any
  ): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `Especialistas/${uid}`);

      await updateDoc(userDocRef, { [campo]: valor });

      console.log(`Campo ${campo} agregado al usuario ${uid}`);
    } catch (error) {
      console.error('Error al agregar el campo: ', error);
    }
  }

  async agregarCampoExtraPaciente(
    uid: string,
    campo: string,
    valor: any
  ): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `Pacientes/${uid}`);

      await updateDoc(userDocRef, { [campo]: valor });

      console.log(`Campo ${campo} agregado al usuario ${uid}`);
    } catch (error) {
      console.error('Error al agregar el campo: ', error);
    }
  }

  async agregarCampoExtraTurno(
    uidPaciente: string,
    campo: string,
    valor: any,
    fecha: string,
    hora: string
  ): Promise<void> {
    try {
      const turnosCollectionRef = collection(this.firestore, 'Turnos');

      const q = query(
        turnosCollectionRef,
        where('uidPaciente', '==', uidPaciente),
        where('Fecha', '==', fecha),
        where('Hora', '==', hora)
      );

      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        const turnoDoc = querySnapShot.docs[0];
        const turnoDocRef = doc(this.firestore, `Turnos/${turnoDoc.id}`);

        await updateDoc(turnoDocRef, { [campo]: valor });
        console.log(
          `Campo ${campo} agregado al turno con fecha ${fecha} y hora ${hora} para el paciente ${uidPaciente}`
        );
      } else {
        console.log(
          `No se encontró ningún turno para la fecha ${fecha}, hora ${hora} y paciente ${uidPaciente}`
        );
      }
    } catch (error) {
      console.error('Error al agregar el campo: ', error);
    }
  }

  async agregarCampoExtraTurnoEspecialista(
    uidEspecialista: string,
    campo: string,
    valor: any,
    fecha: string,
    hora: string
  ): Promise<void> {
    try {
      const turnosCollectionRef = collection(this.firestore, 'Turnos');

      const q = query(
        turnosCollectionRef,
        where('especialistaId', '==', uidEspecialista),
        where('Fecha', '==', fecha),
        where('Hora', '==', hora)
      );

      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        const turnoDoc = querySnapShot.docs[0];
        const turnoDocRef = doc(this.firestore, `Turnos/${turnoDoc.id}`);

        await updateDoc(turnoDocRef, { [campo]: valor });
        console.log(
          `Campo ${campo} agregado al turno con fecha ${fecha} y hora ${hora} para el paciente ${uidEspecialista}`
        );
      } else {
        console.log(
          `No se encontró ningún turno para la fecha ${fecha}, hora ${hora} y paciente ${uidEspecialista}`
        );
      }
    } catch (error) {
      console.error('Error al agregar el campo: ', error);
    }
  }

  async agregarTurno(especialistaId: string, turnoDato: any): Promise<void> {
    try {
      const turnoRef = collection(this.firestore, 'Turnos');
      await addDoc(turnoRef, {
        ...turnoDato,
        especialistaId: especialistaId,
        estadoTurno: 'activo',
      });
      console.log('Turno agregado correctamente');
    } catch (error) {
      console.error('Error al agregar el turno: ', error);
    }
  }

  async guardarHistoriaClinica(
    uidPaciente: string,
    historiaClinica: any,
    fechaHistoriaClinica: string,
    horaHistoriaClinica: string,
    uidEspecialista: string,
    nombreEspecialista: string,
    especialidadEspecialista: string
  ) {
    // Comprobar si el documento del paciente existe
    const pacienteSnapshot = await getDocs(
      query(
        collection(this.firestore, 'Pacientes'),
        where('uid', '==', uidPaciente)
      )
    );

    if (!pacienteSnapshot.empty) {
      // Crear referencia a la subcolección `historiaClinicas` dentro del paciente encontrado
      const historiaClinicaRef = doc(
        this.firestore,
        `Pacientes/${uidPaciente}/historiaClinicas/${Date.now()}` // UID único para cada historia clínica
      );

      // Combinar los datos
      const datosCompletos = {
        ...historiaClinica,
        fechaHistoriaClinica,
        horaHistoriaClinica,
        uidEspecialista,
        nombreEspecialista,
        especialidadEspecialista,
      };

      // Guardar la historia clínica en la subcolección
      return setDoc(historiaClinicaRef, datosCompletos, { merge: true });
    } else {
      throw new Error('No se encontró un paciente con ese UID.');
    }
  }

  async obtenerHistorialClinico(uidPaciente: string) {
    try {
      const historialClinicoRef = collection(
        this.firestore,
        `Pacientes/${uidPaciente}/historiaClinicas`
      );

      const snapShot = await getDocs(historialClinicoRef);

      const historialClinico = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return historialClinico;
    } catch (error) {
      console.error('Error al obtener el historial clinico: ', error);
      throw new Error('No se pudo obtener el historial clinico del paciente.');
    }
  }

  async obtenerAllTurnos() {
    try {
      const turnosRef = collection(this.firestore, 'Turnos');
      const q = query(turnosRef);

      const turnosSnapshot = await getDocs(q);
      const turnos = turnosSnapshot.docs.map((doc) => doc.data());
      return turnos;
    } catch (error) {
      console.error('Error al obtener los turnos del especialista: ', error);
      return [];
    }
  }

  async obtenerTurnosPorEspecialista(especialista: any) {
    try {
      const turnosRef = collection(this.firestore, 'Turnos');
      const q = query(
        turnosRef,
        where('especialistaId', '==', especialista.uid)
      );

      const turnosSnapshot = await getDocs(q);
      const turnos = turnosSnapshot.docs.map((doc) => doc.data());
      return turnos;
    } catch (error) {
      console.error('Error al obtener los turnos del especialista: ', error);
      return [];
    }
  }

  async obtenerTurnosPorPacientes(paciente: any) {
    try {
      const turnosRef = collection(this.firestore, 'Turnos');
      const q = query(turnosRef, where('uidPaciente', '==', paciente.uid));

      const turnosSnapshot = await getDocs(q);
      const turnos = turnosSnapshot.docs.map((doc) => doc.data());
      return turnos;
    } catch (error) {
      console.error('Error al obtener los turnos del especialista: ', error);
      return [];
    }
  }

  async obtenerTurnosOcupados(especialistaId: string, fecha: string) {
    const turnosRef = collection(this.firestore, 'Turnos');
    const q = query(
      turnosRef,
      where('especialistaId', '==', especialistaId),
      where('Fecha', '==', fecha)
    );

    const turnosSnapshot = await getDocs(q);
    console.log('turnosSnapshot docs:', turnosSnapshot.docs);
    const horariosOcupados = turnosSnapshot.docs.map(
      (doc) => doc.data()['Hora']
    );
    console.log('Horarios ocupados:', horariosOcupados);
    return horariosOcupados;
  }

  logOut() {
    return signOut(this.auth);
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getUsuarioActual() {
    return this.auth.currentUser;
  }

  // getUsuarioPersistente(): User | null {
  //   return this.usuarioPersistente;
  // }
}
