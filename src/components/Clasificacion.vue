<template>
    <div :class="`clasificacion pos-${tipo}`">
        <img class="imgFondo" :src="`/assets/img/fondo${tipo}.png`" alt="">
        <img :src="foto" class="imgProfile" alt="" />
        <div class="labelNombre">
            <p class="m-0 font-gamers">{{ nombre }}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        tipo: String,
        foto: String,
        nombre: String,
        top: String,
    },

}
</script>
<style scoped>
.clasificacion {
    width: 270px;
    height: 300px;
    display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    
    .clasificacion>.imgEtiqueta {
        position: relative;
        z-index: 3;
    }
    
    .clasificacion>.imgProfile {
        position: relative;
        width: 135px;
        height: 135px;
        border-radius: 50%;
    z-index: 2;
    top: 13px;
}



.clasificacion>.imgFondo {
    position: absolute;
}

.Oro {
    background-color: #FBD05B;
}

.Platino {
    background-color: #B4D0F8;
}

.Cobre {
    background-color: #9B5E13;
}

.clasificacion>.labelNombre {
    top: 68px;
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
}

.badgeDiv {
    position: relative;
    top: 66px;
    z-index: 5;
    display: flex;
    justify-content: center;
}
</style>
