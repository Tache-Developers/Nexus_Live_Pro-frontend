<template>
  <div class="game">
    <Toast />
    <div class="form-container" v-show="form">
      <p class="title">SAMYFLW</p>
      <div class="form">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input name="TikTok" placeholder="Ingrese su TikTok" v-model="usuario" />
        </div>
        <div class="input-group">
          <select v-model="tiempo">
            <option selected disabled>Seleccione una opción</option>
            <option value="10000">10 segundos</option>
            <option value="30000">30 segundos</option>
            <option value="60000">1 Minuto</option>
            <option value="120000">2 Minutos</option>
            <option value="300000">5 Minutos</option>
            <option value="600000">10 Minutos</option>
            <option value="1200000">20 Minutos</option>
            <option value="1800000">30 Minutos</option>
          </select>
        </div>
        <button :disabled="btnDisable" class="sign" type="button" @click="startGame()">
          Ingresar
        </button>
      </div>
      <div class="social-message">
        <div class="line"></div>
        <p class="message">Agencia Latam</p>
        <div class="line"></div>
      </div>
      <div class="social-icons">
        <a aria-label="Log in with Whatsapp" class="icon" href="https://api.whatsapp.com/send?phone=573176205370">
          <!-- Nuevo código SVG para Instagram -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        <a aria-label="Log in with Instagram" class="icon" href="https://www.instagram.com/samyflw1/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a aria-label="Log in with GitHub" class="icon" href="https://www.tiktok.com/@samyflw">
          <svg fill="#000000" width="800px" height="800px" viewBox="0 0 512 512" id="icons"
            xmlns="http://www.w3.org/2000/svg">

            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

            <g id="SVGRepo_iconCarrier">

              <path
                d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />

            </g>

          </svg>
        </a>
      </div>
    </div>
    <!--  -->

    <button v-show="!form" @click="reiniciar()" class="reiniciar">
      Volver
    </button>
    <div class="volumen" v-show="!form">
      <Slider v-model="volumen" orientation="vertical" v-on:slideend="changeVolumen()" :step="5" />
    </div>
    <button v-show="!form" class="reiniciar patosB">Patos: {{ patos }}</button>
    <button v-show="buttonStart" @click="iniciarJuego()" class="reiniciar btnEmpezar">
      Empezar
    </button>
    <button v-show="!form" :class="classSonido" @click="toggleMute()">
      {{ btnSonido }}
    </button>
    <Button v-show="!form" class="puntos" label="Puntos" @click="dialogVisible = true" />
    <Dialog v-model:visible="dialogVisible" :header="'Jugadores: ' + players.length" :style="{ width: '75vw' }"
      maximizable modal :contentStyle="{ height: '300px' }">
      <DataTable :value="players" sortField="point" :sortOrder="-1" stripedRows scrollable scrollHeight="flex"
        tableStyle="min-width: 1rem">
        <Column field="name" header="Nombres"></Column>
        <Column field="point" header="Puntos"></Column>
        <Column field="skin" header="Skin"></Column>
      </DataTable>
      <template #footer>
        <Button label="Ok" @click="dialogVisible = false" />
      </template>
    </Dialog>
    <div class="gameContainer">
      <button v-show="timerShow" class="count">
        <vue-countdown v-if="timerShow" :time="tiempo" v-slot="{ days, hours, minutes, seconds }">
          {{ minutes < 10 ? "0" + minutes : minutes }}:{{ seconds < 10 ? "0" + seconds : seconds }} </vue-countdown>
      </button>
      <canvas id="gameCanvas" v-show="!form"></canvas>
    </div>
  </div>
</template>
<script>
import Phaser from "phaser";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { io } from "socket.io-client";
import { useToast } from "primevue/usetoast";
import axios from "axios";

export default {
  components: {
    VueCountdown,
  },
  data: () => ({
    btnDisable: false,
    game: null,
    usuario: null,
    tiempo: null,
    apitiktok: null,
    form: true,
    patitoImg: null,
    patos: 0,
    buttonStart: false,
    timerShow: false,
    socket: null,
    btnSonido: "Mute",
    classSonido: "btnRojo",
    dialogVisible: false,
    players: [],
    volumen: 100,
    toast: null,
    API: "https://patosgame.fly.dev"
  }),
  methods: {
    async startGame() {

      if (this.usuario == null || this.usuario == "" || this.tiempo == null) {
        return;
      }
      this.btnDisable = true;
      let exist = false;
      await axios.get(`${this.API}/user/acount/${this.usuario}`).then(resp => {
        exist = resp.data;
      })
      this.btnDisable = false;
      if (!exist) {
        this.toast.add({ severity: 'error', summary: 'Usuario No Registrado!', detail: 'Comuniquese con la agencia samyflw', life: 5000 });
        return;
      }
      this.form = false;
      this.buttonStart = true;
      const vueDataInstance = this;
      const urlSocket = this.API;
      const usuario = this.usuario;
      const tiempo = parseInt(this.tiempo);
      const fechaActual = new Date();
      const timestamp = fechaActual.getTime();
      const id = usuario + '_' + timestamp;
      console.log(id);
      this.socket = io(urlSocket, {
        query: {
          name: usuario,
          id: id,
          time: tiempo,
        },
      });

      const gameCanvas = document.getElementById("gameCanvas");

      // Tamaño de la pantalla
      const size = {
        width: 1000,
        height: 556,
      };
      let posicionY = 1;

      // Clase para el pato
      class Duck extends Phaser.GameObjects.Container {
        constructor(scene, x, y, nombre, skin, id) {
          super(scene, x, y);
          this.ID = id;
          // Agregar la imagen del pato al contenedor
          this.duckImage = scene.add.sprite(0, 0, skin).setOrigin(0.5, 0.5);
          this.duckImage.setScale(0.2);
          this.add(this.duckImage);

          // Crear un gráfico para el fondo con esquinas redondeadas
          const labelBackground = scene.add.graphics();
          labelBackground.fillStyle(0xffffff, 1); // Color oro, opacidad 1
          labelBackground.fillRoundedRect(-30, -40, 60, 20, 10); // x, y, width, height, radius
          this.add(labelBackground);

          // Crear la etiqueta con el nombre
          const label = scene.add.text(0, -40, nombre, {
            fontFamily: "Arial",
            fontSize: "16px",
            color: "#000000",
          });
          label.setOrigin(0.5, 0.5);
          this.add(label);

          // Ajustar el ancho del fondo al ancho del texto
          this.labelWidth = label.width + 20; // Puedes ajustar el valor del padding según tus necesidades
          labelBackground
            .clear()
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(
              -this.labelWidth / 2,
              -48,
              this.labelWidth,
              20,
              10
            );

          // Configuración de la animación yoyo
          const tweenConfig = {
            targets: this,
            y: y - 10,
            duration: 2000,
            ease: "Linear",
            yoyo: true,
            repeat: -1,
          };

          scene.tweens.add(tweenConfig);

          // Agregar el contenedor al escenario
          scene.add.existing(this);
        }

        move(mov) {
          if (mov <= size.width - 100) {
            this.scene.tweens.add({
              targets: this,
              x: mov,
              duration: 5000,
              ease: "Linear",
            });
          }
        }

        alinear(ducksWin) {
          const movimientosX = [800, 700, 600, 500, 400, 300];
          ducksWin.forEach((duck, index) => {
            if (duck.id == this.ID) {
              this.scene.tweens.add({
                targets: this,
                x: movimientosX[index],
                duration: 5500,
                ease: "Linear",
              });
            }
          });
        }

        cisne(id, skin) {
          if (id == this.ID) {
            // Cambiar la imagen del pato
            this.getAt(0).setTexture("cisne").setScale(0.3);

            // Cambiar el color del fondo del labelBackground
            const labelBackground = this.getAt(1); // Asegúrate de que el índice sea el correcto
            labelBackground.clear();
            labelBackground.fillStyle(0xd4af37, 1); // Color y opacidad
            labelBackground.fillRoundedRect(
              -this.labelWidth / 2,
              -48,
              this.labelWidth,
              20,
              10
            );

            // Crear un temporizador para revertir la apariencia después de un tiempo
            this.scene.time.delayedCall(
              60000,
              () => {
                // Restaurar la imagen original del pato
                this.getAt(0).setTexture(skin).setScale(0.2);
                // Restaurar el color original del fondo del labelBackground
                labelBackground.clear();
                labelBackground.fillStyle(0xffffff, 1); // Color y opacidad originales
                labelBackground.fillRoundedRect(
                  -this.labelWidth / 2,
                  -48,
                  this.labelWidth,
                  20,
                  10
                );
              },
              [],
              this
            );
          }
        }

        destruir(ducks) {
          const ducksWin = ducks.some((duck) => duck.id === this.ID);
          if (ducksWin) {
            this.cisne(this.ID, "cisne");
          } else {
            this.destroy();
          }
        }

        update() {
          // Lógica de actualización del pato si es necesario
        }
      }

      // Aqui creo la escena de fondo en el juego
      class GameScene extends Phaser.Scene {
        constructor() {
          super("scene-game");
          this.gameActive = true;
          this.coins = 0;
          this.espera = true;
          this.ganador = [];
          this.players = [];
          this.gifts = {
            5655: 50, // Rose
            7934: 50, // Heart Me
            5827: 50, // Ice Cream Cone
            6064: 50, // GG
            9139: 100, //  Team Bracelet
            5487: 250, // Finger Heart
            6483: 500, // Spinning Top
            5879: 1500, // Doughnut
            5585: 5000, // Confetti
            5660: 5000, // Hand Heart
            6671: 10000, //Love You
            6267: 15000, // Corgi
            7168: 25000, // Money Gun
            5978: 45000, // Train
            6233: 50000, // Travel With You
            6646: 245000, // Leon the Kitten
            8916: 485000, // Leon and Lili
            8912: 750000, // Rosa Nebula
            6369: 1500000, // Lion
            7312: 2000000, // TikTok Universe+
          };
          this.skin = [
            'patitoceleste',
            'patitomorado',
            'patitorojo',
            'patitoblanco',
            'patitochicle',
            'patitonegro',
            'patitorosa',
            'patitoblue',
            'patitogris',
            'patito',
            'patitoverde',
          ];

          this.giftsMoney = {
            5655: 1, // Rose
            7934: 1, // Heart Me
            5827: 1, // Ice Cream Cone
            6064: 1, // GG
            9139: 2, //  Team Bracelet
            5487: 5, // Finger Heart
            6483: 10, // Spinning Top
            5879: 30, // Doughnut
            5585: 100, // Confetti
            5660: 100, // Hand Heart
            6671: 199, //Love You
            6267: 299, // Corgi
            7168: 500, // Money Gun
            5978: 899, // Train
            6233: 999, // Travel With You
            6646: 4888, // Leon the Kitten
            8916: 9699, // Leon and Lili
            8912: 15000, // Rosa Nebula
            6369: 29900, // Lion
            7312: 34999, // TikTok Universe+
          };

        }

        preload() {
          const bgN = Math.floor(Math.random() * 10) + 1;
          this.load.image("cisne", "/assets/img/cisne.png");
          this.load.image("patitoceleste", "/assets/img/patitoceleste.png");
          this.load.image("patitomorado", "/assets/img/patitomorado.png");
          this.load.image("patitorojo", "/assets/img/patitorojo.png");
          this.load.image("patitoblanco", "/assets/img/patitoblanco.png");
          this.load.image("patitochicle", "/assets/img/patitochicle.png");
          this.load.image("patitonegro", "/assets/img/patitonegro.png");
          this.load.image("patitorosa", "/assets/img/patitorosa.png");
          this.load.image("patitoblue", "/assets/img/patitoblue.png");
          this.load.image("patitogris", "/assets/img/patitogris.png");
          this.load.image("patito", "/assets/img/patito.png");
          this.load.image("patitoverde", "/assets/img/patitoverde.png");
          this.load.audio("quack", "/assets/audio/quack.mp3");
          this.load.audio("win", "/assets/audio/win.mp3");
          this.load.audio("backgroundMusic", `/assets/audio/bg${bgN}.mp3`);
          this.load.video("bg", "/assets/video/fondo.mp4", true);
        }

        async create() {
          this.muteNot = true;
          let video = this.add.video(500, 277, "bg");
          video.play(true);
          this.backgroundMusic = this.sound.add("backgroundMusic", {
            loop: true,
          });
          this.quackMusic = this.sound.add("quack");
          this.winMusic = this.sound.add("win", { loop: true });
          this.backgroundMusic.play();
          this.ducks = [];


          vueDataInstance.$data.socket.on('gift', (user) => {
            if (!this.gameActive) {
              return;
            }
            if (this.espera) {
              this.handleEventoApiEspera(
                {
                  userId: user.userId,
                  nickname: user.nickname,
                },
              );
              return;
            }
            const puntosExiste = this.gifts[user.giftId];
            // Se verifica que el regalo exista en this.gifts
            if (puntosExiste == undefined && puntosExiste == null) {
              return;
            }
            this.coins = this.coins + this.giftsMoney[user.giftId];
            this.handleEventoApi(
              {
                userId: user.userId,
                nickname: user.nickname,
              },
              puntosExiste,
            );
          })

          vueDataInstance.$data.socket.on('chat', (user) => {
            if (!this.gameActive) {
              return;
            }
            if (this.espera) {
              this.handleEventoApiEspera(
                {
                  userId: user.userId,
                  nickname: user.nickname,
                },
              );
              return;
            }
            this.handleEventoApi(
              {
                userId: user.userId,
                nickname: user.nickname,
              },
              5,
            );
          })

          vueDataInstance.$data.socket.on('like', (user) => {
            if (!this.gameActive) {
              return;
            }
            if (this.espera) {
              this.handleEventoApiEspera(
                {
                  userId: user.userId,
                  nickname: user.nickname,
                },
              );
              return;
            }
            this.handleEventoApi(
              {
                userId: user.userId,
                nickname: user.nickname,
              },
              user.likeCount,
            );
          })


          // const background = this.add.image(size.width / 2, size.height / 2, "bg").setOrigin(0.5, 0.5);
          // background.setScale(size.width / background.width, size.height / background.height);
        }
        changeVolumen(volumen) {
          this.backgroundMusic.setVolume(volumen);
          this.quackMusic.setVolume(volumen);
          this.winMusic.setVolume(volumen);
        }

        handleEventoApi(
          user,
          puntos,
        ) {
          const players = this.players;
          const playerIndex = players.findIndex(
            (player) => player.id === user.userId,
          );

          if (playerIndex !== -1) {
            const player = players[playerIndex];
            player.point += puntos;

            if (puntos >= 250) {
              this.cisne(player);
            }
          } else {
            let skin = this.skin[Math.floor(Math.random() * this.skin.length)];
            this.players.push({
              id: user.userId,
              name: user.nickname,
              point: puntos,
              x: 1,
              skin: skin,
            });
          }

          const pointMax = this.mayorPuntaje();
          this.calcularPuntosPatos(pointMax);
          if (playerIndex !== -1) {
            this.move(players)
          }
          else {
            this.newPlayer(players);
          }
        }

        handleEventoApiEspera(user) {
          const siExiste = this.players.some((player) => {
            if (player.id == user.userId) {
              return true;
            }
          });
          if (siExiste) {
            return;
          }
          let skin = this.skin[Math.floor(Math.random() * this.skin.length)];
          this.players.push({
            id: user.userId,
            name: user.nickname,
            point: 1,
            x: 100,
            skin: skin,
          });
          this.newPlayer(this.players)
        }

        calcularPuntosPatos(pointMax) {
          this.players.forEach((player) => {
            const x =
              (100 - (Math.abs(pointMax - player.point) / pointMax) * 100) * 8;

            player.x = Math.ceil(x); // Redondear a un número entero
          });
        }

        calcularGanadores() {
          const players = this.players;
          const top6Players = players
            .slice()
            .sort((a, b) => b.point - a.point)
            .slice(0, 6);
          this.ganador = top6Players;
        }

        mayorPuntaje() {
          const players = this.players;
          if (typeof players == 'undefined') {
            return;
          }
          let maxPoint = -Infinity;
          for (const player of players) {
            if (player.point > maxPoint) {
              maxPoint = player.point;
            }
          }

          return maxPoint;
        }

        cisne(OneduckApi) {
          this.ducks.forEach((duck) => {
            duck.cisne(OneduckApi.id, OneduckApi.skin);
          });
        }

        newPlayer(duckApi) {
          vueDataInstance.$data.players = duckApi;
          vueDataInstance.$data.patos += 1;
          const duck = new Duck(
            this,
            200,
            size.height - posicionY * 30,
            duckApi[duckApi.length - 1].name,
            duckApi[duckApi.length - 1].skin,
            duckApi[duckApi.length - 1].id
          );
          if (this.muteNot) {
            this.quackMusic.play();
          }
          this.ducks.push(duck);
          if (posicionY == 10) {
            posicionY = 0;
          }
          posicionY++;
          this.ducks.forEach((duck, index) => {
            duck.move(duckApi[index].x);
          });
        };

        move(duckApi) {
          vueDataInstance.$data.players = duckApi;
          this.ducks.forEach((duck, index) => {
            duck.move(duckApi[index].x);
          });
        };

        ganadores(ducksWins) {
          vueDataInstance.$data.socket.disconnect();
          this.ducks.forEach((duck) => {
            duck.destruir(ducksWins);
          });
          this.ducks.forEach((duck) => {
            duck.alinear(ducksWins);
          });
          this.backgroundMusic.stop();
          setTimeout(this.winMusic.play(), 1000);
        };

        empezarGame() {
          this.espera = false;
          // Los calculos cuando termina el juego y se fija la duracion de la partida
          setTimeout(async () => {
            this.gameActive = false;
            const pointMax = this.mayorPuntaje();
            this.calcularPuntosPatos(pointMax);
            this.move(this.players);
            this.calcularGanadores();
            this.ganadores(this.ganador);
            const history = {
              date: new Date(),
              playerTotal: this.players.length,
              coinTotal: this.coins,
              timeTotal: tiempo,
            };
            await axios.post(`${urlSocket}/user/gamePoints/${usuario}`, history);
            // emitir socket 
          }, tiempo);
        }




        update() { }

        mutear() {
          this.muteNot = !this.muteNot;
          if (this.muteNot) {
            this.backgroundMusic.play();
          } else {
            this.backgroundMusic.stop();
            this.winMusic.stop();
          }
        }
      }

      // configuracion del canva-game
      const config = {
        type: Phaser.WEBGL,
        width: size.width,
        height: size.height,
        canvas: gameCanvas,
        scene: [GameScene],
        physics: {
          default: "arcade",
        },
        autoFocus: false,
      };

      //constructor del juego
      this.game = new Phaser.Game(config);
    },
    reiniciar() {
      this.game.destroy(true);
      location.reload(true);
    },
    toggleMute() {
      if (this.classSonido == "btnRojo") {
        this.classSonido = "btnVerde";
        this.btnSonido = "Escuchar";
      } else {
        this.classSonido = "btnRojo";
        this.btnSonido = "Mute";
      }
      let instanciaPhaser = this.game.scene.getScene("scene-game");
      instanciaPhaser.mutear();
    },
    changeVolumen() {
      let instanciaPhaser = this.game.scene.getScene("scene-game");
      instanciaPhaser.changeVolumen(this.volumen / 100);
    },
    iniciarJuego() {
      this.tiempo = parseInt(this.tiempo);
      this.buttonStart = false;
      this.timerShow = true;
      let instanciaPhaser = this.game.scene.getScene("scene-game");
      instanciaPhaser.empezarGame();
    },
  },
  mounted() {
    this.toast = useToast();
  }
};
</script>
<style scoped>
.game {
  margin: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.form-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  border-radius: 0.75rem;
  background-color: rgba(17, 24, 39, 1);
  padding: 2rem;
  color: rgba(243, 244, 246, 1);
}

.title {
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
}

.form {
  margin-top: 1.5rem;
}

.input-group {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.input-group label {
  display: block;
  color: rgba(156, 163, 175, 1);
  margin-bottom: 4px;
}

.input-group input {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 0.75rem 1rem;
  color: rgba(243, 244, 246, 1);
  margin-top: 20px;
}

.input-group select {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(55, 65, 81, 1);
  outline: 0;
  background-color: rgba(17, 24, 39, 1);
  padding: 0.75rem 1rem;
  color: rgba(243, 244, 246, 1);
}

.input-group input:focus {
  border-color: rgba(167, 139, 250);
}

.forgot {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgba(156, 163, 175, 1);
  margin: 8px 0 14px 0;
}

.forgot a,
.signup a {
  color: rgba(243, 244, 246, 1);
  text-decoration: none;
  font-size: 14px;
}

.forgot a:hover,
.signup a:hover {
  text-decoration: underline rgba(167, 139, 250, 1);
}

.sign {
  margin-top: 20px;
  display: block;
  width: 100%;
  background-color: rgba(167, 139, 250, 1);
  padding: 0.75rem;
  text-align: center;
  color: rgba(17, 24, 39, 1);
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
}

.social-message {
  display: flex;
  align-items: center;
  padding-top: 1rem;
}

.line {
  height: 1px;
  flex: 1 1 0%;
  background-color: rgba(55, 65, 81, 1);
}

.social-message .message {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(156, 163, 175, 1);
}

.gameContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 1;
}

.reiniciar {
  left: 20px;
  top: 40px;
  position: absolute;
  background: #fbca1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.btnRojo {
  right: 20px;
  top: 40px;
  position: absolute;
  background: #fb1f1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.btnVerde {
  right: 20px;
  top: 40px;
  position: absolute;
  background: #1fc8fb;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.puntos {
  left: 20px;
  top: 220px;
  position: absolute;
  background: #fbca1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
}

.patosB {
  top: 100px;
}

.reiniciar:hover {
  transform: translate(-0.05em, -0.05em);
  box-shadow: 0.15em 0.15em;
}

.reiniciar:active {
  transform: translate(0.05em, 0.05em);
  box-shadow: 0.05em 0.05em;
}

.btnEmpezar {
  background-color: rgb(3, 194, 3);
}

.count {
  position: absolute;
  top: 10%;
  left: 35%;
  transform: translate(-50%, -50%);
  background: #fbca1f;
  font-family: inherit;
  padding: 0.6em 1.3em;
  font-weight: 900;
  font-size: 18px;
  border: 3px solid black;
  border-radius: 0.4em;
  box-shadow: 0.1em 0.1em;
  cursor: pointer;
  z-index: 2;
}

.volumen {
  position: absolute;
  right: 65px;
  top: 110px;
}

.social-icons {
  display: flex;
  justify-content: center;
}

.social-icons .icon {
  border-radius: 0.125rem;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  margin-left: 8px;
}

.social-icons .icon svg {
  height: 1.25rem;
  width: 1.25rem;
  fill: #fff;
}
</style>
