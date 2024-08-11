<template>
    <div class="Insignias">
        <Dialog header="Administrar Insignias" v-model:visible="mostrarInsignias" @hide="dialogOculto()">

            <div class="flex gap-6 flex-wrap justify-content-center">
                <div style="width: 250px; height: 330px" v-for="insignia in insignias" :key="insignia.secure_url">
                    <div class="relative flex justify-content-center" style="margin-bottom: 10px;">
                        <img width="250px" height="250px" :src="insignia.secure_url" alt="Insignia"
                            class="border-round imgInsignias" />
                        <Tag :value="insignia.descripcion" class="absolute" style="left:5px; top: 5px" />
                    </div>
                    <div class="flex justify-content-center align-items-center">
                        <Button v-if="butonClass" @click="eliminarInsignia(insignia.public_id, insignia.secure_url)"
                            icon="pi pi-trash" severity="danger" outlined />
                        <Button v-else icon="pi pi-spin pi-spinner" severity="danger" outlined />
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>
<script>
import axios from 'axios';
import { useStoreEvento } from '../store';

export default {
    props: ['mostrarInsigniasProp'],
    data: () => ({
        API: import.meta.env.VITE_APP_API,
        mostrarInsignias: false,
        butonClass: true,
        store: null,
        token: null,
        insignias: null,

    }),
    watch: {
        mostrarInsigniasProp(newV, old) {
            this.mostrarInsignias = newV;
            this.getInsignias();
        }
    },
    methods: {
        dialogOculto() {
            this.$emit('dialogOculto');
        },
        async getInsignias() {
            axios.get(`${this.API}/usuario/insigniasCloud`, this.token).then(resp => {
                this.insignias = resp.data;
            })
        },
        async eliminarInsignia(id, url) {
            this.butonClass = false;
            await axios.post(`${this.API}/usuario/insigniaDelete`, {
                public_id: id,
                secure_url: url,
            }, this.token).then(async () => {
                await this.getInsignias()
                this.$toast.add({ severity: 'success', summary: 'Insignia', detail: 'Eliminado correctamente!', life: 1600 });
            }).catch(error => {
                switch (error.response.data.statusCode) {
                    case 401:
                        //Se le termino la sesión
                        this.store.clearUser();
                        this.$router.push('/login');
                        break;
                    default:
                        this.$toast.add({ severity: 'error', summary: 'Insignia', detail: 'Ocurrio un problema inesperado!', life: 1600 });
                        console.log('Error: ', error);
                        break;
                }
            });
            this.butonClass = true;
        }
    },

    async created() {
        this.store = useStoreEvento();
        this.token = {
            headers: {
                Authorization: `Bearer ${this.store.getToken()}`,
            }
        }
        await this.getInsignias()

    }
}
</script>
<style scoped></style>