import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class HomePage implements OnInit {
  characters: any[] = [];
  currentPage = 1;
  totalPages = 0;
  searchQuery = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters(event?: any) {
    if (this.loading) return;

    this.loading = true;
    const baseUrl = `https://rickandmortyapi.com/api/character`;
    const url = this.searchQuery
      ? `${baseUrl}/?page=${this.currentPage}&name=${this.searchQuery}`
      : `${baseUrl}/?page=${this.currentPage}`;

    this.http.get<any>(url).subscribe(
      (res) => {
        this.characters = [...this.characters, ...res.results];
        this.totalPages = res.info.pages;
        this.currentPage++;
        this.loading = false;

        if (event) event.target.complete();
        if (this.currentPage > this.totalPages && event) event.target.disabled = true;
      },
      (error) => {
        if (event) event.target.complete();
        this.loading = false;
        if (this.currentPage === 1) this.characters = []; // Limpiar si no hay resultados
      }
    );
  }

  onSearchChange() {
    this.characters = [];
    this.currentPage = 1;
    this.loadCharacters();
  }

  goToDetails(id: number) {
    this.router.navigate(['/detalles', id]);
  }

  getImageURL(character: any): string {
    return character.image;
  }
}
