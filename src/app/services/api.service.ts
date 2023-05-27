import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from './models/usuario';
import { Rol } from './models/rol';
import { Permiso } from './models/permiso';
import { Doctor } from './models/doctor';
import { Especialidad } from './models/especialidad';
import { Paciente } from './models/paciente';
import { Cita } from './models/cita';
import { Expediente } from './models/expediente';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //Auth
  login(usuario: Usuario): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, this.getFormData(usuario))
      .pipe(
        tap((response) => {
          if (response && response.access_token) {
            localStorage.setItem('access_token', response.access_token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string {
    return localStorage.getItem('access_token') ?? '';
  }

  getProfile(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/profile`);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/users`);
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/users/${id}`);
  }

  createUsuario(user: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/users`, this.getFormData(user));
  }

  updateUsuario(id: number, user: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/users/${id}`, this.getFormUrlEncoded(user));
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  getUsuarioRoles(id: number): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/users/${id}/roles`);
  }

  addRolToUsuario(id: number, role: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/users/${id}/roles`, this.getFormData(role));
  }

  deleteRolFromUsuario(id: number, roleId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}/roles/${roleId}`);
  }

  getAllRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }

  getRoleById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/roles/${id}`);
  }

  createRole(role: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/roles`, this.getFormData(role));
  }

  updateRole(id: number, role: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/roles/${id}`, this.getFormUrlEncoded(role));
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/roles/${id}`);
  }

  getUsersByRoleId(id: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/roles/${id}/users`);
  }

  addPermisoToRole(id: number, permiso: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/roles/${id}/permiso`, this.getFormData(permiso));
  }

  deletePermisoFromRole(id: number, permisoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/roles/${id}/permiso/${permisoId}`);
  }

  getAllPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.apiUrl}/permisos`);
  }

  getPermisoById(id: number): Observable<Permiso> {
    return this.http.get<Permiso>(`${this.apiUrl}/permisos/${id}`);
  }

  createPermiso(permiso: Permiso): Observable<Permiso> {
    return this.http.post<Permiso>(`${this.apiUrl}/permisos`, this.getFormData(permiso));
  }

  updatePermiso(id: number, permiso: Permiso): Observable<Permiso> {
    return this.http.put<Permiso>(`${this.apiUrl}/permisos/${id}`, this.getFormUrlEncoded(permiso));
  }

  deletePermiso(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/permisos/${id}`);
  }

  getRolesByPermisoId(id: number): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/permisos/${id}/roles`);
  }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctor`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/doctor/${id}`);
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/doctor`, this.getFormData(doctor));
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/doctor/${id}`, this.getFormUrlEncoded(doctor));
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/doctor/${id}`);
  }

  getUserByDoctorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/doctor/${id}/user`);
  }

  getEspecialidadByDoctorId(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/doctor/${id}/especialidad`);
  }

  addEspecialidadToDoctor(id: number, especialidad: Especialidad): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctor/${id}/especialidad`, this.getFormData(especialidad));
  }

  deleteEspecialidadFromDoctor(id: number, especialidadId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/doctor/${id}/especialidad/${especialidadId}`);
  }

  getAllEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}/especialidad`);
  }

  getEspecialidadById(id: number): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.apiUrl}/especialidad/${id}`);
  }

  createEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(`${this.apiUrl}/especialidad`, this.getFormData(especialidad));
  }

  updateEspecialidad(id: number, especialidad: Especialidad): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.apiUrl}/especialidad/${id}`, this.getFormUrlEncoded(especialidad));
  }

  deleteEspecialidad(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/especialidad/${id}`);
  }

  getDoctorsByEspecialidadId(id: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/especialidad/${id}/doctor`);
  }

  getAllPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/paciente`);
  }

  getPacienteById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/paciente/${id}`);
  }

  createPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/paciente`, this.getFormData(paciente));
  }

  updatePaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/paciente/${id}`, this.getFormUrlEncoded(paciente));
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/paciente/${id}`);
  }

  getCitasByPacienteId(id: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/paciente/${id}/cita`);
  }

  getAllCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/cita`);
  }

  getCitaById(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/cita/${id}`);
  }

  createCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/cita`, this.getFormData(cita));
  }

  updateCita(id: number, cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/cita/${id}`, this.getFormUrlEncoded(cita));
  }

  deleteCita(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cita/${id}`);
  }

  getPacienteByCitaId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/cita/${id}/paciente`);
  }

  getDoctorByCitaId(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/cita/${id}/doctor`);
  }

  getUsersByCitaId(id: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/cita/${id}/usuario`);
  }

  getAllExpedientes(): Observable<Expediente[]> {
    return this.http.get<Expediente[]>(`${this.apiUrl}/expediente`);
  }

  getExpedienteById(id: number): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.apiUrl}/expediente/${id}`);
  }

  createExpediente(expediente: Expediente): Observable<Expediente> {
    return this.http.post<Expediente>(`${this.apiUrl}/expediente`, this.getFormData(expediente));
  }

  updateExpediente(id: number, expediente: Expediente): Observable<Expediente> {
    return this.http.put<Expediente>(`${this.apiUrl}/expediente/${id}`, this.getFormUrlEncoded(expediente));
  }

  deleteExpediente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/expediente/${id}`);
  }

  getCitaByExpedienteId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/expediente/${id}/cita`);
  }

  getFormData(object: any) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
  }

  getFormUrlEncoded(object: any): HttpParams {
    let params = new HttpParams();
    Object.keys(object).forEach((key) => {
      params = params.append(key, object[key]);
    });
    return params;
  }
}
