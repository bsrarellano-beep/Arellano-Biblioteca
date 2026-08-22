import { CommonModule } from '@angular/common';
import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
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
    temporal?: boolean;
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
    templateUrl: './videos.html'
})
export class VideosComponent implements OnInit, OnDestroy {

    textoBusqueda = '';
    categoriaSeleccionada = 'todos';
    videoSeleccionado: Video | null = null;

    // Formulario
    mostrarFormulario = false;
    nuevoTitulo = '';
    nuevaDescripcion = '';
    nuevaCategoria = '';

    archivoSeleccionado: File | null = null;
    nombreArchivo = '';
    duracionArchivo = '00:00';
    mensajeError = '';

    videos: Video[] = [
        {
            id: 1,
            titulo: 'Curso completo de Angular y Tailwind CSS',
            descripcion:
                'Introducción al desarrollo de aplicaciones modernas con Angular y Tailwind CSS.',
            duracion: 'Calculando...',
            categoria: 'programacion',
            miniatura:
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/angular.mp4'
        },
        {
            id: 2,
            titulo: 'Introducción a Docker y Kubernetes',
            descripcion:
                'Conceptos fundamentales sobre contenedores, Docker y Kubernetes.',
            duracion: 'Calculando...',
            categoria: 'devops',
            miniatura:
                'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/docker.mp4'
        },
        {
            id: 3,
            titulo: 'Modelado de bases de datos con PostgreSQL',
            descripcion:
                'Principios para diseñar y administrar bases de datos relacionales.',
            duracion: 'Calculando...',
            categoria: 'base-datos',
            miniatura:
                'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/postgresql.mp4'
        },
        {
            id: 4,
            titulo: 'Principios de UI/UX para desarrollo web',
            descripcion:
                'Fundamentos de diseño de interfaces y experiencia de usuario.',
            duracion: 'Calculando...',
            categoria: 'diseno',
            miniatura:
                'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
            archivo: 'videos/diseno.mp4'
        }
    ];

    ngOnInit(): void {
        this.calcularDuracionVideosIniciales();
    }

    get videosFiltrados(): Video[] {
        const texto = this.textoBusqueda
            .trim()
            .toLowerCase();

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

    /**
     * Calcula automáticamente la duración de los videos
     * que están registrados inicialmente en el arreglo.
     */
    calcularDuracionVideosIniciales(): void {
        this.videos.forEach((video: Video) => {
            this.obtenerDuracionDesdeUrl(video.archivo)
                .then((duracion: string) => {
                    video.duracion = duracion;
                })
                .catch(() => {
                    video.duracion = 'No disponible';
                });
        });
    }

    /**
     * Obtiene la duración de un video mediante su URL.
     */
    obtenerDuracionDesdeUrl(url: string): Promise<string> {
        return new Promise((
            resolve: (value: string) => void,
            reject: () => void
        ) => {
            const elementoVideo = document.createElement('video');

            elementoVideo.preload = 'metadata';
            elementoVideo.src = url;

            elementoVideo.onloadedmetadata = () => {
                const duracion = this.formatearDuracion(
                    elementoVideo.duration
                );

                elementoVideo.removeAttribute('src');
                elementoVideo.load();

                resolve(duracion);
            };

            elementoVideo.onerror = () => {
                elementoVideo.removeAttribute('src');
                elementoVideo.load();

                reject();
            };
        });
    }

    abrirFormulario(): void {
        this.mostrarFormulario = true;
        this.mensajeError = '';
    }

    cerrarFormulario(): void {
        this.mostrarFormulario = false;
        this.limpiarFormulario();
    }

    seleccionarArchivo(event: Event): void {
        const input = event.target as HTMLInputElement;
        const archivo = input.files?.[0];

        this.mensajeError = '';

        if (!archivo) {
            return;
        }

        const formatosPermitidos = [
            'video/mp4',
            'video/webm',
            'video/ogg'
        ];

        if (!formatosPermitidos.includes(archivo.type)) {
            this.mensajeError =
                'Formato no permitido. Selecciona un archivo MP4, WebM u OGG.';

            input.value = '';
            return;
        }

        // Tamaño máximo: 200 MB
        const tamanioMaximo = 200 * 1024 * 1024;

        if (archivo.size > tamanioMaximo) {
            this.mensajeError =
                'El archivo supera el tamaño máximo permitido de 200 MB.';

            input.value = '';
            return;
        }

        this.archivoSeleccionado = archivo;
        this.nombreArchivo = archivo.name;
        this.duracionArchivo = 'Calculando...';

        // Utiliza el nombre del archivo como título inicial
        if (!this.nuevoTitulo.trim()) {
            this.nuevoTitulo = archivo.name.replace(
                /\.[^/.]+$/,
                ''
            );
        }

        this.calcularDuracionArchivo(archivo);
    }

    /**
     * Calcula automáticamente la duración del archivo
     * seleccionado desde la computadora.
     */
    calcularDuracionArchivo(archivo: File): void {
        const urlTemporal = URL.createObjectURL(archivo);
        const elementoVideo = document.createElement('video');

        elementoVideo.preload = 'metadata';
        elementoVideo.src = urlTemporal;

        elementoVideo.onloadedmetadata = () => {
            this.duracionArchivo = this.formatearDuracion(
                elementoVideo.duration
            );

            elementoVideo.removeAttribute('src');
            elementoVideo.load();

            URL.revokeObjectURL(urlTemporal);
        };

        elementoVideo.onerror = () => {
            this.duracionArchivo = 'No disponible';

            elementoVideo.removeAttribute('src');
            elementoVideo.load();

            URL.revokeObjectURL(urlTemporal);
        };
    }

    agregarVideo(): void {
        this.mensajeError = '';

        if (!this.nuevoTitulo.trim()) {
            this.mensajeError =
                'Debes escribir el título del video.';
            return;
        }

        if (!this.nuevaDescripcion.trim()) {
            this.mensajeError =
                'Debes escribir una descripción.';
            return;
        }

        if (!this.nuevaCategoria) {
            this.mensajeError =
                'Debes seleccionar una categoría.';
            return;
        }

        if (!this.archivoSeleccionado) {
            this.mensajeError =
                'Debes seleccionar un archivo de video.';
            return;
        }

        if (this.duracionArchivo === 'Calculando...') {
            this.mensajeError =
                'Espera mientras se calcula la duración del video.';
            return;
        }

        const urlVideo = URL.createObjectURL(
            this.archivoSeleccionado
        );

        const nuevoVideo: Video = {
            id: Date.now(),
            titulo: this.nuevoTitulo.trim(),
            descripcion: this.nuevaDescripcion.trim(),
            duracion: this.duracionArchivo,
            categoria: this.nuevaCategoria,
            miniatura:
                'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
            archivo: urlVideo,
            temporal: true
        };

        this.videos = [
            nuevoVideo,
            ...this.videos
        ];

        this.cerrarFormulario();
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

    eliminarVideo(video: Video): void {
        if (this.videoSeleccionado?.id === video.id) {
            this.videoSeleccionado = null;
        }

        if (
            video.temporal &&
            video.archivo.startsWith('blob:')
        ) {
            URL.revokeObjectURL(video.archivo);
        }

        this.videos = this.videos.filter(
            (item: Video) => item.id !== video.id
        );
    }

    limpiarFiltros(): void {
        this.textoBusqueda = '';
        this.categoriaSeleccionada = 'todos';
    }

    limpiarFormulario(): void {
        this.nuevoTitulo = '';
        this.nuevaDescripcion = '';
        this.nuevaCategoria = '';
        this.archivoSeleccionado = null;
        this.nombreArchivo = '';
        this.duracionArchivo = '00:00';
        this.mensajeError = '';
    }

    /**
     * Convierte segundos en:
     * MM:SS cuando dura menos de una hora.
     * HH:MM:SS cuando dura una hora o más.
     */
    formatearDuracion(segundosTotales: number): string {
        if (
            !Number.isFinite(segundosTotales) ||
            segundosTotales < 0
        ) {
            return '00:00';
        }

        const horas = Math.floor(
            segundosTotales / 3600
        );

        const minutos = Math.floor(
            (segundosTotales % 3600) / 60
        );

        const segundos = Math.floor(
            segundosTotales % 60
        );

        const minutosFormateados = minutos
            .toString()
            .padStart(2, '0');

        const segundosFormateados = segundos
            .toString()
            .padStart(2, '0');

        if (horas > 0) {
            const horasFormateadas = horas
                .toString()
                .padStart(2, '0');

            return (
                `${horasFormateadas}:` +
                `${minutosFormateados}:` +
                `${segundosFormateados}`
            );
        }

        return (
            `${minutosFormateados}:` +
            `${segundosFormateados}`
        );
    }

    ngOnDestroy(): void {
        this.videos
            .filter((video: Video) => video.temporal)
            .forEach((video: Video) => {
                if (video.archivo.startsWith('blob:')) {
                    URL.revokeObjectURL(video.archivo);
                }
            });
    }
}