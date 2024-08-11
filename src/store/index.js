import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
    state: () => ({
        user: null,
        sessionTime: null,
    }),

    actions: {
        isActive() {
            console.log(this.user);
            if (this.user) {
                return true;
            }
            return false;
        },
        saveUser(user) {
            console.log("guardando")
            this.user = user;
            this.sessionTime = new Date();
            console.log(this.user);

        },
        token() {
            return this.user.access_token;
        },
        clearUser() {
            this.user = null;
            this.sessionTime = null;
        }
    },
});

export const useStoreEvento = defineStore('evento', {
    state: () => ({
        user: null,
        evento: {
            evento : null,
            categoria : null,
            premio : null
        },
    }),

    actions: {

            eventoID(id,categoria,premio){
                this.evento.evento= id;
                this.evento.categoria= categoria;
                this.evento.premio = premio;
            },
            eventoDelete(){
                this.evento ={
                    evento : null,
                    categoria : null,  
                    premio : null
                };
            },

        isActive() {
            let u;
            try {
                u = JSON.parse(localStorage.user);
            } catch (error) {
                u = null;
            }

            return u != null;
        },
        isAdmin() {
            const u = JSON.parse(localStorage.user);
            return u.rol.toLowerCase() == "admin";
        },
        saveUser(user) {
            localStorage.user = JSON.stringify(user);
            this.user = user;

        },
        newDatos(user) {
            localStorage.user = JSON.stringify({...user, access_token: this.getToken() });
            this.user = {...user, access_token: this.getToken() };
        },
        getToken() {
            const u = JSON.parse(localStorage.user);
            return u.access_token;
        },
        getUsuario() {
            return JSON.parse(localStorage.user);
        },
        getId() {
            const u = JSON.parse(localStorage.user);
            return u._id;
        },
        getFoto() {
            const u = JSON.parse(localStorage.user);
            return u.foto;
        },
        clearUser() {
            this.user = null;
            localStorage.user = null;
        },
    },
});

export const useStoreMezcla = defineStore('mezcla', {
    state: () => ({
        grupos: null
    }),
    actions: {
        getGrupo() {
            try {
                this.grupos = JSON.parse(localStorage.grupos);
            } catch (error) {
                this.grupos = null;
            }
            return this.grupos;
        },
        saveMezcla(grupos = "A-B") {
            localStorage.grupos = JSON.stringify(grupos);
            this.grupos = grupos;
        },
        reiniciarMezcla() {
            localStorage.grupos = null;
            this.grupos = null;
        }
    }
});