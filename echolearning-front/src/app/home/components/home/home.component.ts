import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from './user.service';
import { take, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from './users.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['nombres', 'apellidos', 'email', 'acciones'];
  isLinear = false;
  selectedUser: UserModel = { idUsuario: 0 };
  usuarioForm = new FormGroup({
    nombres: new FormControl(),
    apellidos: new FormControl(),
    email: new FormControl(),
  });
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  users$ = new BehaviorSubject<UserModel[]>([]);

  constructor(private userSer: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userSer
      .getUsers()
      .pipe(take(1))
      .subscribe(
        (res: UserModel[]) => {
          this.users$.next(res);
        },
        (err) => console.log(err)
      );
  }
  enviarUsuarioForm() {
    if (this.selectedUser.idUsuario === 0) {
      this.userSer
        .createUser(this.usuarioForm.value)
        .pipe(take(1))
        .subscribe(
          (res) => {
            this.getUsers();
            this.clearForm();
          },
          (err) => console.log(err)
        );
    } else {
      this.userSer
        .updateUser({
          ...this.usuarioForm.value,
          idUsuario: this.selectedUser.idUsuario,
        })
        .pipe(take(1))
        .subscribe(
          (res) => {
            this.getUsers();
            this.clearForm();
          },
          (err) => console.log(err)
        );
    }
  }
  editUser(usuario: UserModel) {
    this.selectedUser = usuario;
    this.usuarioForm.controls['nombres'].setValue(usuario.nombres);
    this.usuarioForm.controls['apellidos'].setValue(usuario.apellidos);
    this.usuarioForm.controls['email'].setValue(usuario.email);
  }
  deleteUser(usuario: UserModel) {
    this.userSer
      .deleteUser(usuario.idUsuario)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.getUsers();
          this.clearForm();
        },
        (err) => console.log(err)
      );
    debugger;
  }

  clearForm() {
    this.selectedUser = { idUsuario: 0 };
    this.usuarioForm.reset();
  }
}
