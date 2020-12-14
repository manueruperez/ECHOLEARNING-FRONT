import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModel } from './users.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${environment.apiUrl}/usuarios`);
  }
  createUser(user: UserModel) {
    return this.http.post(`${environment.apiUrl}/usuarios/crear`, {
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
    });
  }
  updateUser(user: UserModel) {
    return this.http.put(
      `${environment.apiUrl}/usuarios/editar/${user.idUsuario}`,
      {
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
      }
    );
  }
  deleteUser(idUsuario: number) {
    return this.http.delete(
      `${environment.apiUrl}/usuarios/eliminar/${idUsuario}`
    );
  }
}
