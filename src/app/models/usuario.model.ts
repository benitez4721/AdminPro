

export class Usuario {

    constructor(

        public nombre: string,
        public email: string,
        public img: string,
        public google?: boolean,
        public role?: string,
        public password?: string,
        public uid?: string
    ) {}

}    
