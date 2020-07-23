import { environment  } from "../../environments/environment";


const base_url = environment.base_url
export class Usuario {

    constructor(

        public nombre: string,
        public email: string,
        public img: string,
        public google?: boolean,
        public role?: string,
        public uid?: string,
        public password?: string,
    ) {}

    get imagenUrl() {
        // http://localhost:3005/api/upload/usuarios/422ebf27-d7b9-4356-8b6d-7e2b99706a1a.png
        
        if (this.img.includes('https')) {
            return this.img
        }
        if( this.img ){
            
            return `${ base_url }/upload/usuarios/${ this.img }`
        }
        return `${ base_url }/upload/usuarios/no-image`
    }

}    
