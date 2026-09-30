import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  todos: any[] = [];

  username = '';
  password = '';

  loggedInUser = '';

  token: string | null = localStorage.getItem('token');

  constructor(private httpClient: HttpClient) {
    if (this.token) {
      this.loggedInUser = localStorage.getItem('username') || '';
      this.loadTodos();
    }
  }

  login() {
    alert('Kullanıcı: [' + this.username + ']');
    alert('Şifre: [' + this.password + ']');

    if (
      (this.username === 'admin' && this.password === '1234') ||
      (this.username === 'hacer' && this.password === '1234')
    ) {
      alert('GİRİŞ BAŞARILI');

      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('username', this.username);

      this.token = 'fake-token';
      this.loggedInUser = this.username;

      this.loadTodos();
    } else {
      alert('GİRİŞ BAŞARISIZ');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.token = null;
    this.loggedInUser = '';
    this.todos = [];
  }

  loadTodos() {
    this.httpClient.get<any[]>('http://localhost:8080/api/todos').subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo(input: HTMLInputElement) {
    const title = input.value;

    if (!title.trim()) {
      return;
    }

    this.httpClient
      .post('http://localhost:8080/api/todos', {
        title: title,
        completed: false,
      })
      .subscribe(() => {
        input.value = '';

        this.loadTodos();
      });
  }

  deleteTodo(id: number) {
    this.httpClient.delete(`http://localhost:8080/api/todos/${id}`).subscribe(() => {
      this.loadTodos();
    });
  }

  toggleTodo(todo: any) {
    this.httpClient
      .put(`http://localhost:8080/api/todos/${todo.id}`, {
        id: todo.id,
        title: todo.title,
        completed: !todo.completed,
      })
      .subscribe(() => {
        todo.completed = !todo.completed;
      });
  }
}
