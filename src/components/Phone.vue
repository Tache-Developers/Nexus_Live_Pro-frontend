<template>
    <div class="container">
        <div class="text">
            <div class="container2">
                <h1>Hola somos </h1>
                <a href="" class="logo"> <span>Samy</span>flw</a>
            </div>
            <ul>
                <li>Estaras los mejores streamers del top LatinoAmerica</li>
                <li>No cobramos comisiones por nuestro trabajo.</li>
                <li>Capacitaciones y acompañamiento constantes.</li>
                <li>Participaciones en eventos anticipados y exclusivos</li>
                <li>Premiaciones para los mejores EMISORES DEL MES.</li>
                <li>Bonificación de reclutamiento por nuevos EMISORES.</li>
                <li>Protecion de cuenta, mínima y soporte mejor.</li>
                <li>Poder participar en las Premiaciones de los TikTok Awards.</li>
                <li>Los mejores estrategias y consejos en crecimiento personal.</li>

            </ul>

        </div>
        <section>
            <div class="outside-border">
                <video autoplay="autoplay" loop="loop" id="video_background" preload="auto" volume="0">
                    <source src="../assets/video/tiktok.mp4" type="video/mp4" />
                </video>
                <div class="silencer"></div>
                <div class="volume-up"></div>
                <div class="volume-down"></div>
                <div class="button-on"></div>
                <div class="inside-border">

                    <!-- Camera -->

                    <div class="camera">
                        <div class="camera-dot">
                            <div class="camera-dot-2"></div>
                            <div class="camera-dot-3"></div>
                        </div>
                        <div class="camera-speaker">
                        </div>
                    </div>

                    <!-- Bottom Line -->

                    <div class="bottom-line"></div>

                </div>
            </div>
        </section>


    </div>
</template>
<script>
export default {

}
</script>
<style scoped>
* {
    box-sizing: border-box;
}

.container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #F4F4F4;
    flex-wrap: wrap;
}

.container2 {
    margin: 20px -20px 0px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;


}

.container2 a {
    color: #0b2035 !important;
}

.text {
    min-width: 33%;
    justify-content: center;
    align-items: center;
    color: #0b2035;
}

body {
    color: #0b2035;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px;
}



section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 75px 0;
    min-width: 23%;
}

.outside-border {
    position: relative;
    width: 212px;
    height: 438px;
    border: 0.6px solid white;
    border-radius: 35px;
    background-color: #0b2035;

}

.silencer {
    position: absolute;
    background-color: white;
    border-radius: 5px;
    width: 2px;
    height: 13px;
    left: -2px;
    top: 81.5px;
    opacity: 0.8;
}

.volume-up,
.volume-down {
    position: absolute;
    background-color: white;
    border-radius: 5px;
    height: 28px;
    width: 1px;
    left: -1.5px;
    opacity: 0.8;
}

.volume-up {
    top: 110px;
}

.volume-down {
    top: 148px;
}

.button-on {
    position: absolute;
    background-color: white;
    border-radius: 5px;
    height: 45px;
    width: 2px;
    right: -2px;
    opacity: 0.8;
    top: 121px;
}

.inside-border {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 6px solid black;
    border-radius: 35px;
}

.camera {
    display: flex;
    justify-content: center;
    position: relative;
    width: 76px;
    height: 20px;
    background-color: black;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    top: 0;
}

.camera-dot {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 5px;
    height: 5px;
    left: 12px;
    top: 5px;
}

.camera-dot-2 {
    position: absolute;
    background-color: #fff;
    border-radius: 50%;
    width: 4px;
    height: 4px;
    opacity: 0.3;
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06), 0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12);
    filter: blur(1px);
}

.camera-dot-3 {
    position: absolute;
    background-color: #000;
    border-radius: 50%;
    width: 1px;
    height: 1px;
    opacity: 0.7;
}

.camera-speaker {
    position: absolute;
    background-color: #fff;
    width: 28px;
    height: 1px;
    border-radius: 20px;
    top: -3px;
    opacity: 0.2;
}

.bottom-line {
    position: absolute;
    height: 2px;
    width: 80px;
    background-color: #fff;
    bottom: 6px;
    border-radius: 2px;
    opacity: 0.8;
}

#video_background {
    position: absolute;
    top: 35px;
    width: 206px;


}
</style>