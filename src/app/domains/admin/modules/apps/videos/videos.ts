import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface Video {
    id: number;
    titulo: string;
    descripcion: string;
    duracion: string;
    categoria: string;
    miniatura: string;
    archivo: string;
}

@Component({
    selector: 'app-videos',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule
    ],
    templateUrl: './videos.html',
    styleUrl: './videos.css'
})
export class VideosComponent {

    textoBusqueda = '';
    categoriaSeleccionada = 'todos';
    videoSeleccionado: Video | null = null;

    videos: Video[] = [
        {
            id: 1,
            titulo: 'Curso completo de Angular y Tailwind CSS',
            descripcion: 'Introducción al desarrollo de aplicaciones modernas con Angular y Tailwind CSS.',
            duracion: '15:20',
            categoria: 'programacion',
            miniatura: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/angular.mp4'
        },
        {
            id: 2,
            titulo: 'Introducción a Docker y Kubernetes',
            descripcion: 'Conceptos fundamentales sobre contenedores, Docker y Kubernetes.',
            duracion: '22:45',
            categoria: 'devops',
            miniatura: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/docker.mp4'
        },
        {
            id: 3,
            titulo: 'Modelado de bases de datos con PostgreSQL',
            descripcion: 'Principios para diseñar y administrar bases de datos relacionales.',
            duracion: '18:10',
            categoria: 'base-datos',
            miniatura: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/postgresql.mp4'
        },
        {
            id: 4,
            titulo: 'Principios de UI/UX para desarrollo web',
            descripcion: 'Fundamentos de diseño de interfaces y experiencia de usuario.',
            duracion: '12:05',
            categoria: 'diseno',
            miniatura: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/diseno.mp4'
        }
    ];

    get videosFiltrados(): Video[] {
        const texto = this.textoBusqueda.trim().toLowerCase();

        return this.videos.filter((video: Video) => {
            const coincideTexto =
                video.titulo.toLowerCase().includes(texto) ||
                video.descripcion.toLowerCase().includes(texto);

            const coincideCategoria =
                this.categoriaSeleccionada === 'todos' ||
                video.categoria === this.categoriaSeleccionada;

            return coincideTexto && coincideCategoria;
        });
    }

    reproducirVideo(video: Video): void {
        this.videoSeleccionado = video;

        setTimeout(() => {
            document
                .getElementById('reproductor')
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
        });
    }

    cerrarVideo(): void {
        this.videoSeleccionado = null;
    }

    limpiarFiltros(): void {
        this.textoBusqueda = '';
        this.categoriaSeleccionada = 'todos';
    }
}