import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Firestore, addDoc, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.page.html',
  styleUrls: ['./detalles.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class DetallesPage implements OnInit {
  character: any;
  comment: string = '';
  savedComment: string = '';
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Carga personaje
      this.character = await this.http
        .get(`https://rickandmortyapi.com/api/character/${id}`)
        .toPromise();

      // Carga comentarios para el personaje
      await this.loadComments();
    }
  }

  async saveComment() {
  if (!this.comment.trim()) return;

  try {
    const commentsRef = collection(this.firestore, 'comments');
    await addDoc(commentsRef, {
      characterId: this.character.id,
      comment: this.comment,
      timestamp: new Date(),
      characterInfo: {
        name: this.character.name,
        species: this.character.species,
        status: this.character.status,
        gender: this.character.gender,
        origin: this.character.origin.name,
        location: this.character.location.name,
        image: this.character.image,
        url: this.character.url
      }
    });

    this.savedComment = this.comment;
    this.comment = '';
    await this.loadComments();

    console.log('Comentario con personaje guardado');
  } catch (e) {
    console.error('Error guardando comentario:', e);
  }
}


  async loadComments() {
  if (!this.character?.id) return;

  const commentsRef = collection(this.firestore, 'comments');
  const q = query(commentsRef, where('characterId', '==', this.character.id));
  try {
    const querySnapshot = await getDocs(q);
   this.comments = querySnapshot.docs.map(doc => {
  const data = doc.data();
  return {
    ...data,
    timestamp: data['timestamp'] ? (data['timestamp'] instanceof Date ? data['timestamp'] : data['timestamp'].toDate()) : null,
  };
});
  } catch (e) {
    console.error('Error cargando comentarios:', e);
  }
}
}
