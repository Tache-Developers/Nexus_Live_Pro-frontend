<template>
    <div class="editarPerfil">
        <Toast />
        <Dialog v-model:visible="mostrarEditarPerfil" @hide="dialogEditarOculto" header="Editar datos" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
            <form ref="formEditarPerfil" enctype="multipart/form-data">
                <div class="flex flex-column gap-1 mb-2" v-if="!store.isAdmin()">
                    <label for="fotoPerfil" class="font-bold block">Foto de perfil</label>
                    <InputText type="file" id="fotoPerfil" @change="asignarImagen" aria-describedby="foto-help" accept="image/png, image/jpg, image/jpeg, image/webp,image/gif" />
                    <small id="foto-help">Cargar imagen para modificar la actual.</small>
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="correo" class="font-bold block">Correo</label>
                    <InputText type="email" id="correo" v-model="paquete.correo" />
                </div>
                <div class="flex flex-column gap-1 mb-3">
                    <label for="telefono" class="font-bold block">Teléfono</label>
                    <InputText type="tel" id="telefono" v-model="paquete.telefono" />
                </div>
                <div class="flex flex-column gap-1 mb-2">
                    <label for="contrasena">Contraseña</label>
                    <InputText type="text" v-model="paquete.contrasena" id="contrasena" aria-describedby="contrasena-help" />
                    <small id="contrasena-help">Llenar para modificar la actual.</small>
                </div>
            </form>
            <template #footer>
                <Button label="Cancelar" @click="mostrarEditarPerfil = false" text severity="danger" autofocus />
                <Button label="Editar" @click="editarUsuario" :disabled="btnEditarPerfil" severity="success" />
            </template>
        </Dialog>
    </div>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from '../store';
export default {
    props: ['mostrarEditar'],
    name: 'dialogEditarPerfil',
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        store: null,
        mostrarEditarPerfil: false,
        paquete: {
            foto: null,
            correo: null,
            telefono: null,
            contrasena: null
        },
        btnEditarPerfil: false
    }),
    watch: {
        mostrarEditar(newV, old) {
            this.mostrarEditarPerfil = newV;
        }
    },
    methods: {
        dialogEditarOculto() {
            this.$emit('dialogEditarOculto');
        },
        asignarImagen(event) {
            this.paquete.foto = event.target.files[0];
        },
        async editarUsuario() {
            if (this.paquete.correo != null && this.paquete.telefono != null) {
                this.btnEditarPerfil = true;
                if (this.store.isAdmin()) {
                    delete this.paquete.foto;
                }
                await axios.putForm(`${this.API}/usuario/${this.store.getId()}`, this.paquete, {
                    headers: {
                        Authorization: `Bearer ${this.store.getToken()}`
                    }
                }).then(response => {
                    if (response.data.editado) {
                        this.$toast.add({ severity: 'success', summary: 'Editar datos', detail: response.data.message, life: 1500 });
                        this.mostrarEditarPerfil = false;
                        this.$refs.formEditarPerfil.reset();
                        this.$emit('perfilActualizado');
                    } else {
                        this.$toast.add({ severity: 'success', summary: 'Editar datos', detail: response.data.message, life: 1500 });
                    }
                }).catch(error => {
                    this.$toast.add({ severity: 'error', summary: 'Editar datos', detail: 'Sucedió un error editando los datos', life: 1500 });
                    console.log("Error editando: ", error);
                });
                this.btnEditarPerfil = false;
            } else {
                this.$toast.add({ severity: 'info', summary: 'Editar datos', detail: 'Debe llenar por lo menos, el correo y el teléfono', life: 1500 });
            }
        },
        ponerDatosDef() {
            this.paquete.correo = this.store.getUsuario().correo.length == 0 ? null : this.store.getUsuario().correo;
            this.paquete.telefono = this.store.getUsuario().telefono.length == 0 ? null : this.store.getUsuario().telefono;
        }
    },
    created() {
        this.store = useStoreEvento();
        this.ponerDatosDef();
    }
}
</script>