<template>
    <div class="dialog">
        <Dialog v-model:visible="visibleDialog" :style="{ width: '750px' }" header="Menu de Regalos" :modal="true"
            class="p-fluid ">

           <div class="flex flex-column gap-4">
            <div class="flex flex-column gap-2">
                <div class="flex gap-4">
                    <InputText name="name" type="text" placeholder="Nombre" v-model="giftCreateBody.name" />
                    <InputText name="id" type="number" placeholder="ID" v-model="giftCreateBody.id" />
                </div>
                <div class="flex gap-4">
                    <InputText name="cost" type="number" placeholder="Costo" v-model="giftCreateBody.cost" />
                    <InputText name="points" type="number" placeholder="Puntos" v-model="giftCreateBody.points" />
                </div>
                <InputText name="image" type="text" placeholder="Imagen" v-model="giftCreateBody.image"/>
                <Image v-show="giftCreateBody.image":src="giftCreateBody.image" alt="Image" width="250" preview />
                <Button label="Añadir" @click="createGift()" />
            </div>
            <DataTable paginator :rows="10"  :rowsPerPageOptions="[10, 20, 50]" :value="giftList" dataKey="_id"
                filterDisplay="row" tableStyle="min-width: 40rem"  stripedRows>
                <Column field="name" header="Nombre" sortable></Column>
                <Column field="id" header="ID" sortable></Column>
                <Column field="cost" header="Costo" sortable></Column>
                <Column field="points" header="Puntos" sortable>
                    <template #body="slotProps">
                        <Badge :value="slotProps.data.points" severity="warning"></Badge>
                    </template>
                </Column>
                <Column field="image" header="Imagen" sortable>
                    <template #body="slotProps">
                        <Image :src="slotProps.data.image" alt="Image" width="100" preview />
                    </template>
                </Column>
                <Column header="Acción" sortable>
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" severity="danger" @click="deleteGift(slotProps.data._id)" />
                    </template>
                </Column>
            </DataTable>
           </div>
        </Dialog>
    </div>
</template>
<script>
import axios from 'axios'
import { useSessionStore } from '../../store';
import { useToast } from "primevue/usetoast";
export default {
    name: 'GiftDialog',
    data() {
        return {
            API: "https://patosgame.fly.dev",
            toast: null,
            store: null,
            visibleDialog: false,
            giftCreateBody: {
                name: '',
                id: null,
                cost: null,
                points: null,
                image: null
            },
            giftList: []
        }
    },
    methods: {
        openDialog() {
            this.visibleDialog = true
        },
        async getGiftList() {
            await axios.get(this.API + '/gift', this.token).then(res => {
                this.giftList = res.data
            }).catch(err => {
                this.toast.add({ severity: "error", summary: "Error obteniendo gifts", life: 3000 });
            })
        },
        async deleteGift(id) {
            await axios.delete(this.API + '/gift/' + id, this.token).then(async () => {
                await this.getGiftList()
                this.toast.add({ severity: "success", summary: "Gift eliminado", life: 3000 });
            }).catch(err => {
                this.toast.add({ severity: "error", summary: "Error eliminando gift", life: 3000 });
            })
        },
        async createGift() {
            this.giftCreateBody.id = parseInt(this.giftCreateBody.id);
            this.giftCreateBody.cost = parseInt(this.giftCreateBody.cost);
            this.giftCreateBody.points = parseInt(this.giftCreateBody.points);
            await axios.post(this.API + '/gift/create', this.giftCreateBody, this.token).then(res => {
                this.toast.add({ severity: "success", summary: "Gift creado", life: 3000 });
                this.giftCreateBody = {
                    name: '',
                    id: null,
                    cost: null,
                    points: null,
                    image: null
                }
                this.getGiftList()
            }).catch(err => {
                this.toast.add({ severity: "error", summary: "Error creando gift", life: 3000 });
            })
        }
    },
    async created() {
        this.store = useSessionStore();
        this.toast = useToast();
        if (!this.store.isActive()) {
            this.$router.push('/duckracer/login');
        } else {
            this.token = {
                headers: { Authorization: `Bearer ${this.store.token()}` }
            };
        }
        await this.getGiftList()
    }
}
</script>