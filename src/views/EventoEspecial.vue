<template>
	<div class="app">
		<NavBar></NavBar>
		<Toast />
		<div class="evento">
			<div class="video-container eventos-especiales">
				<video autoplay muted loop>
					<source src="/assets/video/eventos/fondo-eventos.mp4" type="video/mp4" />
					Tu navegador no soporta esta funcionalidad video
				</video>
			</div>
			<div v-if="spiner" class="flex w-full justify-content-center align-items-center" style="min-height: 100vh">
				<ProgressSpinner />
			</div>
			<Card class="px-0" v-else>
				<template #content>
					<TabView class="font-gamers">
						<TabPanel header="Rookie">
							<Accordion :activeIndex="0" v-if="eventoRookie.length > 0" class="font-gamers">
								<AccordionTab v-for="(evento, index) in eventoRookie" :key="index">
									<template #header>
										<div class="w-full flex justify-content-between">
											<p>{{ evento.titulo }}</p>
											<div
												class="aplica color-verde"
												v-tooltip.top="'Participar en el evento'"
												@click="aplicar(evento._id, evento.categoria, evento.titulo)"
											>
												Participar
											</div>
										</div>
									</template>
									<div class="flex justify-content-between md:justify-content-center sm:justify-content-center flex-wrap gap-4">
										<div class="descripcion">
											<div class="container py-1">
												<p class="m-0">{{ evento.descripcion }}</p>
											</div>
										</div>
										<div class="reglas">
											<h2 class="mb-0">REGLAS</h2>
											<div class="container">
												<div class="flex gap-2">
													<div class="item-regla" />
													<p class="m-0">{{ evento.reglas }}</p>
												</div>
											</div>
										</div>
										<div class="progreso">
											<h2 class="mb-0">PROGRESO</h2>
											<div class="container flex flex-column gap-2">
												<p class="fechas m-0">{{ evento.fecha_inicio.slice(0, 10) }} | {{ evento.fecha_fin.slice(0, 10) }}</p>
												<div
													:class="'barra-progreso barra-' + calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[0]"
													:style="`width: ${
														calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] > 100
															? 100
															: calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1]
													}%`"
												>
													{{ calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] }}%
												</div>
											</div>
										</div>
									</div>
									<div class="flex justify-content-around flex-wrap mt-5" style="row-gap: 25px">
										<div v-for="(premio, index) in Object.values(evento.premios)" :key="index" :class="`puesto${index + 1}`">
											<div class="titulo flex flex-column w-full">
												<div class="fondo">
													<p class="m-0">Puesto {{ index + 1 }}</p>
												</div>
											</div>
											<div class="imagen">
												<img :src="premio.imagen" :alt="premio.descripcion" class="border-round imgPremio" />
											</div>
											<div class="descripcion-premio w-full text-center mt-5 p-3">
												<p class="m-0">{{ premio.descripcion }}</p>
											</div>
										</div>
									</div>
									<!-- <DataTable :value="evento.participantes" class="tablaCreadoresEvento especial"
                                        tableStyle="min-width: 8rem" sortField="diamantes_mes_actual" :sortOrder="-1">
                                        <template #header>
                                            <div class="containerC" v-if="evento.participantes.length > 0">
                                                <video autoplay muted loop class="tabla-fondo-header">
                                                    <source src="/assets/video/eventos/tabla-fondo-header.mp4"
                                                        type="video/mp4">
                                                    Tu navegador no soporta esta funcionalidad video
                                                </video>
                                                <Clasificacion :nombre="evento.participantes[1].usuario" top="2"
                                                    tipo="Platino" :foto="evento.participantes[1].foto" />
                                                <Clasificacion top="1" tipo="Oro"
                                                    :nombre="evento.participantes[0].usuario"
                                                    :foto="evento.participantes[0].foto" />
                                                <Clasificacion :nombre="evento.participantes[2].usuario" top="3"
                                                    tipo="Cobre" :foto="evento.participantes[2].foto" />
                                            </div>
                                        </template>
                                        <Column header="#" class="font-gamers" headerStyle="width:3rem">
                                            <template #body="slotProps">
                                                {{ slotProps.index + 1 }}
                                            </template>
                                        </Column>
                                        <Column field="usuario" header="Creador" class="font-gamers">
                                            <template #body="slotProps">
                                                <InlineMessage v-if="slotProps.index == 0" class="font-gamers"
                                                    icon="pi pi-star" severity="warn">
                                                    {{ slotProps.data.usuario }}
                                                </InlineMessage>
                                                <InlineMessage v-else-if="slotProps.index == 1" class="font-gamers"
                                                    icon="pi pi-star" severity="error">
                                                    {{ slotProps.data.usuario }}
                                                </InlineMessage>
                                                <InlineMessage v-else-if="slotProps.index == 2" class="font-gamers"
                                                    icon="pi pi-star" severity="info">
                                                    {{ slotProps.data.usuario }}
                                                </InlineMessage>
                                                <p v-else> {{ slotProps.data.usuario }}</p>
                                            </template>
                                        </Column>
                                        <Column field="diamantes_mes_actual" class="font-gamers" header="Puntos">
                                            <template #body="slotProps">
                                                {{ slotProps.data.diamantes_mes_actual * multiplicador }}
                                            </template>
                                        </Column>
                                        <Column field="diamantes_mes_anterior" class="font-gamers"
                                            header="Puntos Mes Anterior"></Column>
                                        <Column field="grupo" class="font-gamers" header="Grupo">
                                            <template #body="props">
                                                <img :src="`/assets/img/grupos/${props.data.grupo}.png`"
                                                    :alt="`Grupo ${props.data.grupo}`" class="img-grupo">
                                            </template>
                                        </Column>
                                    </DataTable> -->
								</AccordionTab>
							</Accordion>
							<p class="text-center" v-else>Sin eventos</p>
						</TabPanel>
						<TabPanel header="Veteran">
							<Accordion :activeIndex="0" v-if="eventoVeterano.length > 0" class="font-gamers">
								<AccordionTab v-for="(evento, index) in eventoVeterano" :key="index">
									<template #header>
										<div class="w-full flex justify-content-between">
											<p>Evento - {{ evento.titulo }}</p>
											<div
												class="aplica color-verde"
												v-tooltip.top="'Participar en el evento'"
												@click="aplicar(evento._id, evento.categoria, evento.titulo)"
											>
												Participar
											</div>
										</div>
									</template>
									<div class="flex justify-content-between md:justify-content-center sm:justify-content-center flex-wrap gap-4">
										<div class="descripcion">
											<div class="container py-1">
												<p class="m-0">{{ evento.descripcion }}</p>
											</div>
										</div>
										<div class="reglas">
											<h2 class="mb-0">REGLAS</h2>
											<div class="container">
												<div class="flex gap-2">
													<div class="item-regla" />
													<p class="m-0">{{ evento.reglas }}</p>
												</div>
											</div>
										</div>
										<div class="progreso">
											<h2 class="mb-0">PROGRESO</h2>
											<div class="container flex flex-column gap-2">
												<p class="fechas m-0">{{ evento.fecha_inicio.slice(0, 10) }} | {{ evento.fecha_fin.slice(0, 10) }}</p>
												<div
													:class="'barra-progreso barra-' + calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[0]"
													:style="`width: ${
														calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] > 100
															? 100
															: calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1]
													}%`"
												>
													{{ calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] }}%
												</div>
											</div>
										</div>
									</div>
									<div class="flex justify-content-around flex-wrap mt-5" style="row-gap: 25px">
										<div v-for="(premio, index) in Object.values(evento.premios)" :key="index" :class="`puesto${index + 1}`">
											<div class="titulo flex flex-column w-full">
												<div class="fondo">
													<p class="m-0">Puesto {{ index + 1 }}</p>
												</div>
											</div>
											<div class="imagen">
												<img :src="premio.imagen" :alt="premio.descripcion" class="border-round imgPremio" />
											</div>
											<div class="descripcion-premio w-full text-center mt-5 p-3">
												<p class="m-0">{{ premio.descripcion }}</p>
											</div>
										</div>
									</div>
									<DataTable
										:value="evento.participantes"
										class="tablaCreadoresEvento especial"
										tableStyle="min-width: 8rem"
										sortField="diamantes_mes_actual"
										:sortOrder="-1"
									>
										<template #header>
											<div class="containerC" v-if="evento.participantes.length > 0">
												<video autoplay muted loop class="tabla-fondo-header">
													<source src="/assets/video/eventos/tabla-fondo-header.mp4" type="video/mp4" />
													Tu navegador no soporta esta funcionalidad video
												</video>
												<Clasificacion
													:nombre="evento.participantes[1].usuario"
													top="2"
													tipo="Platino"
													:foto="evento.participantes[1].foto"
												/>
												<Clasificacion top="1" tipo="Oro" :nombre="evento.participantes[0].usuario" :foto="evento.participantes[0].foto" />
												<Clasificacion
													:nombre="evento.participantes[2].usuario"
													top="3"
													tipo="Cobre"
													:foto="evento.participantes[2].foto"
												/>
											</div>
										</template>
										<Column header="#" class="font-gamers" headerStyle="width:3rem">
											<template #body="slotProps">
												{{ slotProps.index + 1 }}
											</template>
										</Column>
										<Column field="usuario" header="Creador" class="font-gamers">
											<template #body="slotProps">
												<InlineMessage v-if="slotProps.index == 0" class="font-gamers" icon="pi pi-star" severity="warn">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<InlineMessage v-else-if="slotProps.index == 1" class="font-gamers" icon="pi pi-star" severity="error">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<InlineMessage v-else-if="slotProps.index == 2" class="font-gamers" icon="pi pi-star" severity="info">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<p v-else>{{ slotProps.data.usuario }}</p>
											</template>
										</Column>
										<Column field="diamantes_mes_actual" class="font-gamers" header="Puntos">
											<template #body="slotProps">
												{{ slotProps.data.diamantes_mes_actual * multiplicador }}
											</template>
										</Column>
										<Column field="diamantes_mes_anterior" class="font-gamers" header="Puntos Mes Anterior"></Column>
										<Column field="grupo" class="font-gamers" header="Grupo">
											<template #body="props">
												<img :src="`/assets/img/grupos/${props.data.grupo}.png`" :alt="`Grupo ${props.data.grupo}`" class="img-grupo" />
											</template>
										</Column>
									</DataTable>
								</AccordionTab>
							</Accordion>
							<p class="text-center" v-else>Sin eventos</p>
						</TabPanel>
						<TabPanel header="Pro">
							<Accordion :activeIndex="0" v-if="eventoPro.length > 0" class="font-gamers">
								<AccordionTab v-for="(evento, index) in eventoPro" :key="index">
									<template #header>
										<div class="w-full flex justify-content-between">
											<p>{{ evento.titulo }}</p>
											<div
												class="aplica color-verde"
												v-tooltip.top="'Participar en el evento'"
												@click="aplicar(evento._id, evento.categoria, evento.titulo)"
											>
												Participar
											</div>
										</div>
									</template>
									<div class="flex justify-content-between md:justify-content-center sm:justify-content-center flex-wrap gap-4">
										<div class="descripcion">
											<div class="container py-1">
												<p class="m-0">{{ evento.descripcion }}</p>
											</div>
										</div>
										<div class="reglas">
											<h2 class="mb-0">REGLAS</h2>
											<div class="container">
												<div class="flex gap-2">
													<div class="item-regla" />
													<p class="m-0">{{ evento.reglas }}</p>
												</div>
											</div>
										</div>
										<div class="progreso">
											<h2 class="mb-0">PROGRESO</h2>
											<div class="container flex flex-column gap-2">
												<p class="fechas m-0">{{ evento.fecha_inicio.slice(0, 10) }} | {{ evento.fecha_fin.slice(0, 10) }}</p>
												<div
													:class="'barra-progreso barra-' + calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[0]"
													:style="`width: ${
														calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] > 100
															? 100
															: calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1]
													}%`"
												>
													{{ calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] }}%
												</div>
											</div>
										</div>
									</div>
									<div class="flex justify-content-around flex-wrap mt-5" style="row-gap: 25px">
										<div v-for="(premio, index) in Object.values(evento.premios)" :key="index" :class="`puesto${index + 1}`">
											<div class="titulo flex flex-column w-full">
												<div class="fondo">
													<p class="m-0">Puesto {{ index + 1 }}</p>
												</div>
											</div>
											<div class="imagen">
												<img :src="premio.imagen" :alt="premio.descripcion" class="border-round imgPremio" />
											</div>
											<div class="descripcion-premio w-full text-center mt-5 p-3">
												<p class="m-0">{{ premio.descripcion }}</p>
											</div>
										</div>
									</div>
									<DataTable
										:value="evento.participantes"
										class="tablaCreadoresEvento especial"
										tableStyle="min-width: 8rem"
										sortField="diamantes_mes_actual"
										:sortOrder="-1"
									>
										<template #header>
											<div class="containerC" v-if="evento.participantes.length > 0">
												<video autoplay muted loop class="tabla-fondo-header">
													<source src="/assets/video/eventos/tabla-fondo-header.mp4" type="video/mp4" />
													Tu navegador no soporta esta funcionalidad video
												</video>
												<Clasificacion
													:nombre="evento.participantes[1].usuario"
													top="2"
													tipo="Platino"
													:foto="evento.participantes[1].foto"
												/>
												<Clasificacion top="1" tipo="Oro" :nombre="evento.participantes[0].usuario" :foto="evento.participantes[0].foto" />
												<Clasificacion
													:nombre="evento.participantes[2].usuario"
													top="3"
													tipo="Cobre"
													:foto="evento.participantes[2].foto"
												/>
											</div>
										</template>
										<Column header="#" class="font-gamers" headerStyle="width:3rem">
											<template #body="slotProps">
												{{ slotProps.index + 1 }}
											</template>
										</Column>
										<Column field="usuario" header="Creador" class="font-gamers">
											<template #body="slotProps">
												<InlineMessage v-if="slotProps.index == 0" class="font-gamers" icon="pi pi-star" severity="warn">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<InlineMessage v-else-if="slotProps.index == 1" class="font-gamers" icon="pi pi-star" severity="error">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<InlineMessage v-else-if="slotProps.index == 2" class="font-gamers" icon="pi pi-star" severity="info">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<p v-else>{{ slotProps.data.usuario }}</p>
											</template>
										</Column>
										<Column field="diamantes_mes_actual" class="font-gamers" header="Puntos">
											<template #body="slotProps">
												{{ slotProps.data.diamantes_mes_actual * multiplicador }}
											</template>
										</Column>
										<Column field="diamantes_mes_anterior" class="font-gamers" header="Puntos Mes Anterior"></Column>
										<Column field="grupo" class="font-gamers" header="Grupo">
											<template #body="props">
												<img :src="`/assets/img/grupos/${props.data.grupo}.png`" :alt="`Grupo ${props.data.grupo}`" class="img-grupo" />
											</template>
										</Column>
									</DataTable>
								</AccordionTab>
							</Accordion>
							<p class="text-center" v-else>Sin eventos</p>
						</TabPanel>
						<TabPanel header="Pro+">
							<Accordion v-if="eventoPro2.length > 0" class="font-gamers">
								<AccordionTab v-for="(evento, index) in eventoPro2" :key="index">
									<template #header>
										<div class="w-full flex justify-content-between">
											<p>{{ evento.titulo }}</p>
											<div
												class="aplica color-verde"
												v-tooltip.top="'Participar en el evento'"
												@click="aplicar(evento._id, evento.categoria, evento.titulo)"
											>
												Participar
											</div>
										</div>
									</template>
									<div class="flex justify-content-between md:justify-content-center sm:justify-content-center flex-wrap gap-4">
										<div class="descripcion">
											<div class="container py-1">
												<p class="m-0">{{ evento.descripcion }}</p>
											</div>
										</div>
										<div class="reglas">
											<h2 class="mb-0">REGLAS</h2>
											<div class="container">
												<div class="flex gap-2">
													<div class="item-regla" />
													<p class="m-0">{{ evento.reglas }}</p>
												</div>
											</div>
										</div>
										<div class="progreso">
											<h2 class="mb-0">PROGRESO</h2>
											<div class="container flex flex-column gap-2">
												<p class="fechas m-0">{{ evento.fecha_inicio.slice(0, 10) }} | {{ evento.fecha_fin.slice(0, 10) }}</p>
												<div
													:class="'barra-progreso barra-' + calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[0]"
													:style="`width: ${
														calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] > 100
															? 100
															: calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1]
													}%`"
												>
													{{ calcularPromdioTranscurrido(evento.fecha_inicio, evento.fecha_fin)[1] }}%
												</div>
											</div>
										</div>
									</div>
									<div class="flex justify-content-around flex-wrap mt-5" style="row-gap: 25px">
										<div v-for="(premio, index) in Object.values(evento.premios)" :key="index" :class="`puesto${index + 1}`">
											<div class="titulo flex flex-column w-full">
												<div class="fondo">
													<p class="m-0">Puesto {{ index + 1 }}</p>
												</div>
											</div>
											<div class="imagen">
												<img :src="premio.imagen" :alt="premio.descripcion" class="border-round imgPremio" />
											</div>
											<div class="descripcion-premio w-full text-center mt-5 p-3">
												<p class="m-0">{{ premio.descripcion }}</p>
											</div>
										</div>
									</div>
									<DataTable
										:value="evento.participantes"
										class="tablaCreadoresEvento especial"
										tableStyle="min-width: 8rem"
										sortField="diamantes_mes_actual"
										:sortOrder="-1"
									>
										<template #header>
											<div class="containerC" v-if="evento.participantes.length > 0">
												<video autoplay muted loop class="tabla-fondo-header">
													<source src="/assets/video/eventos/tabla-fondo-header.mp4" type="video/mp4" />
													Tu navegador no soporta esta funcionalidad video
												</video>
												<Clasificacion
													:nombre="evento.participantes[1].usuario"
													top="2"
													tipo="Platino"
													:foto="evento.participantes[1].foto"
												/>
												<Clasificacion top="1" tipo="Oro" :nombre="evento.participantes[0].usuario" :foto="evento.participantes[0].foto" />
												<Clasificacion
													:nombre="evento.participantes[2].usuario"
													top="3"
													tipo="Cobre"
													:foto="evento.participantes[2].foto"
												/>
											</div>
										</template>
										<Column header="#" class="font-gamers" headerStyle="width:3rem">
											<template #body="slotProps">
												{{ slotProps.index + 1 }}
											</template>
										</Column>
										<Column field="usuario" header="Creador" class="font-gamers">
											<template #body="slotProps">
												<InlineMessage v-if="slotProps.index == 0" class="font-gamers" icon="pi pi-star" severity="warn">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<InlineMessage v-else-if="slotProps.index == 1" class="font-gamers" icon="pi pi-star" severity="error">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<InlineMessage v-else-if="slotProps.index == 2" class="font-gamers" icon="pi pi-star" severity="info">
													{{ slotProps.data.usuario }}
												</InlineMessage>
												<p v-else>{{ slotProps.data.usuario }}</p>
											</template>
										</Column>
										<Column field="diamantes_mes_actual" class="font-gamers" header="Puntos">
											<template #body="slotProps">
												{{ slotProps.data.diamantes_mes_actual * multiplicador }}
											</template>
										</Column>
										<Column field="diamantes_mes_anterior" class="font-gamers" header="Puntos Mes Anterior"></Column>
										<Column field="grupo" class="font-gamers" header="Grupo">
											<template #body="props">
												<img :src="`/assets/img/grupos/${props.data.grupo}.png`" :alt="`Grupo ${props.data.grupo}`" class="img-grupo" />
											</template>
										</Column>
									</DataTable>
								</AccordionTab>
							</Accordion>
							<p class="text-center" v-else>Sin eventos</p>
						</TabPanel>
					</TabView>
					<DataTable
						:value="creadores"
						class="tablaCreadoresEvento"
						tableStyle="min-width: 8rem"
						sortField="diamantes_mes_actual"
						:sortOrder="-1"
					>
						<template #header>
							<span class="text-xl text-900 font-bold font-gamers text-center" style="z-index: 1">CREADORES DE CONTENIDO</span>
							<img src="/assets/img/eventos/divisor-titulo.png" alt="Divisor" class="w-full mb-3" style="z-index: 1" />
							<div class="text-center uppercase font-gamers" style="z-index: 1">
								<p class="m-0 text-inline-evento text-6xl color-blue" v-if="all != true">CATEGORÍA {{ grupoMostrado }}</p>
								<p class="m-0 text-inline-evento text-6xl color-blue" v-else>TODOS</p>
							</div>
							<div class="grupos mt-3 mb-5 uppercase font-gamers color-blue" style="z-index: 1">
								<span class="todos" @click="changeCreador('Todos')">Todos</span>
								<span class="rookie" @click="changeCreador('Rookie')">Rookie</span>
								<span class="veteran" @click="changeCreador('Veteran')">Veteran</span>
								<span class="pro" @click="changeCreador('Pro')">Pro</span>
								<span class="pro+" @click="changeCreador('Pro+')">Pro+</span>
							</div>
							<div class="containerC">
								<video autoplay muted loop class="tabla-fondo-header">
									<source src="/assets/video/eventos/tabla-fondo-header.mp4" type="video/mp4" />
									Tu navegador no soporta esta funcionalidad video
								</video>
								<Clasificacion :nombre="top3[1].usuario" top="2" tipo="Platino" :foto="top3[1].foto" />
								<Clasificacion top="1" tipo="Oro" :nombre="top3[0].usuario" :foto="top3[0].foto" />
								<Clasificacion :nombre="top3[2].usuario" top="3" tipo="Cobre" :foto="top3[2].foto" />
							</div>
						</template>
						<Column header="#" class="font-gamers" headerStyle="width:3rem">
							<template #body="slotProps">
								{{ slotProps.index + 1 }}
							</template>
						</Column>
						<Column field="usuario" header="Creador" class="font-gamers">
							<template #body="slotProps">
								<InlineMessage v-if="slotProps.index == 0" class="font-gamers" icon="pi pi-star" severity="warn">
									{{ slotProps.data.usuario }}
								</InlineMessage>
								<InlineMessage v-else-if="slotProps.index == 1" class="font-gamers" icon="pi pi-star" severity="error">
									{{ slotProps.data.usuario }}
								</InlineMessage>
								<InlineMessage v-else-if="slotProps.index == 2" class="font-gamers" icon="pi pi-star" severity="info">
									{{ slotProps.data.usuario }}
								</InlineMessage>
								<p v-else>{{ slotProps.data.usuario }}</p>
							</template>
						</Column>
						<Column field="creator_type" header="Categoría" class="font-gamers" />
						<Column field="diamantes_mes_actual" class="font-gamers" header="Puntos">
							<template #body="slotProps">
								{{ slotProps.data.diamantes_mes_actual * multiplicador }}
							</template>
						</Column>
						<Column field="diamantes_mes_anterior" class="font-gamers" header="Puntos Mes Anterior"></Column>
						<Column field="grupo" class="font-gamers" header="Grupo">
							<template #body="props">
								<img :src="`/assets/img/grupos/${props.data.grupo}.png`" :alt="`Grupo ${props.data.grupo}`" class="img-grupo" />
							</template>
						</Column>
					</DataTable>
				</template>
			</Card>
		</div>

		<Dialog
			v-model:visible="modalAplicar"
			header="Participar"
			:style="{ width: '47rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<div class="card flex justify-content-center">
				<h2>¿Quieres participar en este evento {{ tituloEvento }} de categoria {{ categoriaEvento }}?</h2>
			</div>

			<template #footer>
				<Button label="No quiero" @click="(modalAplicar = false), (verificacionEliminar = null)" text severity="danger" />
				<Button label="Sí quiero" @click="agregarParticipante()" severity="success" autofocus />
			</template>
		</Dialog>
	</div>
</template>
<script>
import axios from "axios";
import { useStoreMezcla } from "../store";
import { useStoreEvento } from "../store";

export default {
	name: "EventoView",
	data: () => ({
		img: null,
		multiplicador: 1,
		API: import.meta.env.VITE_APP_API,
		gruposMezcla: null,
		storeMezcla: null,
		modalAplicar: false,
		spiner: true,
		evento: null,
		verificacionAplicar: null,
		categoriaEvento: null,
		tituloEvento: null,
		eventoRookie: [],
		eventoVeterano: [],
		eventoPro: [],
		eventoPro2: [],
		eventosLabel: [],
		arrayCreadores: [],
		creadores: [],
		paqueteParticipante: {
			participante: null,
			evento: null,
			categoria: null,
			categoriaParticipante: null,
		},
		premios: [
			{
				name: "Silla Gamer",
				image: "https://i.linio.com/p/c3786e7c22a6664d487c3b0c47ee67a3-product.jpg",
			},
			{
				name: "Aro de luz",
				image: "https://static.foto321.com/2021/09/aro-de-luz-321-sirve.jpg",
			},
			{
				name: "Box Ramdon",
				image: "https://toogeek.co/wp-content/uploads/2021/11/D_NQ_NP_864337-MCO45705901406_042021-O.jpg",
			},
		],
		responsiveOptions: [
			{
				breakpoint: "1199px",
				numVisible: 3,
				numScroll: 1,
			},
			{
				breakpoint: "1000px",
				numVisible: 2,
				numScroll: 1,
			},
			{
				breakpoint: "750px",
				numVisible: 1,
				numScroll: 1,
			},
		],
		topInsignias: ["Oro", "Platino", "Cobre"],
		arrayTop3: [],
		top3: [
			{
				usuario: "",
				foto: "",
			},
			{
				usuario: "",
				foto: "",
			},
			{
				usuario: "",
				foto: "",
			},
		],
		all: false,
		grupoMostrado: "Rookie",
	}),
	methods: {
		aplicar(id, categoria, premio) {
			if (!this.store.isActive()) {
				this.store.eventoID(id, categoria, premio);
				this.$router.push("/login");
			} else {
				if (!this.store.isAdmin()) {
					this.modalAplicar = true;
					this.verificacionAplicar = id;
					this.categoriaEvento = categoria;
					this.tituloEvento = premio;
				} else {
					this.$toast.add({ severity: "info", summary: "Participar", detail: "Debes iniciar sesión con tu cuenta de usuario", life: 1600 });
				}
				console.log(this.store.evento);
			}
		},
		ponerEstado(estado) {
			if (estado == "Finalizado") {
				return "warning";
			} else if (estado == "En preparacion") {
				return "info";
			} else {
				return "success";
			}
		},
		async getEvento() {
			await axios
				.get(`${this.API}/sorpresa/evento/categoria`, {})
				.then((response) => {
					const eventos = response.data;
					for (let i = 0; i < eventos.length; i++) {
						if (eventos[i]._id == "Rookie") {
							this.eventoRookie = eventos[i].eventos;
						} else if (eventos[i]._id == "Veteran") {
							this.eventoVeterano = eventos[i].eventos;
						} else if (eventos[i]._id == "Pro") {
							this.eventoPro = eventos[i].eventos;
						} else if (eventos[i]._id == "Pro+") {
							this.eventoPro2 = eventos[i].eventos;
						}
					}
					console.log("rookie", this.eventoRookie, "veterano", this.eventoVeterano, "pro", this.eventoPro, "pro2", this.eventoPro2);
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							console.log("Error: ", error);
							break;
					}
				});
		},
		async agregarParticipante() {
			let creador = this.store.getUsuario();
			this.paqueteParticipante.evento = this.verificacionAplicar;
			this.paqueteParticipante.participante = this.store.getId();
			this.paqueteParticipante.categoria = this.categoriaEvento;
			this.paqueteParticipante.categoriaParticipante = creador.creator_type;

			await axios
				.put(`${this.API}/sorpresa/agreagarParticipante`, this.paqueteParticipante, {
					headers: {
						Authorization: `Bearer ${this.store.getToken()}`,
					},
				})
				.then((response) => {
					console.log(response);
					this.getEvento();
					this.modalAplicar = false;
					if (response.data == "Participante Inscrito") {
						this.$toast.add({
							severity: "success",
							summary: "Éxito",
							detail: response.data,
							life: 1500,
						});
					} else {
						this.$toast.add({
							severity: "error",
							summary: "Éxito",
							detail: response.data,
							life: 1500,
						});
					}
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							console.log("Error: ", error);
							break;
					}
				});
		},
		changeCreador(grupo) {
			if (grupo != "Todos") {
				for (let i = 0; i < this.arrayCreadores.length; i++) {
					if (this.arrayCreadores[i]._id === grupo) {
						this.grupoMostrado = grupo;
						this.creadores = [];
						this.creadores = this.arrayCreadores[i].usuarios;
					}
				}
				this.top3 = this.creadores.slice(0, 3);
				this.all = false;
			} else {
				this.creadores = [];
				for (const creador of this.arrayCreadores) {
					this.creadores = this.creadores.concat(creador.usuarios);
				}
				this.creadores.sort((a, b) => b.diamantes_mes_actual - a.diamantes_mes_actual);
				this.top3 = this.creadores.slice(0, 3);
				this.all = true;
			}
		},
		calcularPromdioTranscurrido(fechaInicio, fechaFin) {
			let fechaI = new Date(fechaInicio);
			let fechaF = new Date(fechaFin);

			let fechaActual = new Date();
			if (fechaActual < fechaI) {
				return 0;
			} else {
				const tiempoTranscurrido = fechaActual - fechaI;

				const tiempoTotal = fechaF - fechaI;

				let porcentajeTranscurrido = (tiempoTranscurrido / tiempoTotal) * 100;

				porcentajeTranscurrido = Math.ceil(porcentajeTranscurrido);
				console.log(porcentajeTranscurrido);
				return [porcentajeTranscurrido < 70 ? "roja" : "verde", porcentajeTranscurrido];
			}
		},
	},
	async created() {
		this.getEvento();
		this.storeMezcla = useStoreMezcla();
		await axios.get(`${this.API}/usuario/agrupados/categoria`).then((resp) => {
			this.arrayCreadores = resp.data;
			for (let i = 0; i < this.arrayCreadores.length; i++) {
				if (this.arrayCreadores[i]._id === "Rookie") {
					this.creadores = [];
					this.creadores = this.arrayCreadores[i].usuarios;
				}
			}
			this.top3 = this.creadores.slice(0, 3);
		});
		this.store = useStoreEvento();
		if (this.store.evento.evento !== null) {
			(this.verificacionAplicar = this.store.evento.evento),
				(this.categoriaEvento = this.store.evento.categoria),
				(this.tituloEvento = this.store.evento.premio),
				(this.modalAplicar = true);
			this.store.eventoDelete();
		}
		this.spiner = false;
	},
};
</script>

<style>
.tablaCreadoresEvento.especial {
	background: black !important;
	background-image: none !important;
}

.p-tabview > .p-tabview-panels {
	padding-left: 0 !important;
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

.video-container.eventos-especiales {
	position: static !important;
}

.eventos-especiales {
	z-index: 3 !important;
}

.p-accordion .p-accordion-header .p-accordion-header-link {
	border: none !important;
	border-radius: none !important;
	background: black !important;
}

.p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link,
.p-accordion .p-accordion-content {
	background: transparent !important;
	border: none !important;
	padding-bottom: 0 !important;
	padding-left: 0 !important;
	padding-right: 0 !important;
	margin-bottom: 10px;
}

.acordeon {
	background: blue !important;
}

.containerC {
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	align-items: end;
	row-gap: 70px;
	justify-content: center;
}

.img-grupo {
	width: 30px !important;
	height: 30px !important;
}

.marco-tabla {
	position: absolute;
	top: 20%;
	width: 100%;
	height: 80%;
	z-index: 4;
	background-size: contain;
}

.clasificacion.pos-Oro {
	width: 400px !important;
	height: 400px !important;
}

.clasificacion.pos-Oro > .imgProfile {
	width: 190px !important;
	top: 6px !important;
	height: 191px !important;
}

.clasificacion.pos-Oro > .labelNombre {
	top: 105px !important;
}

.p-tabview .p-tabview-nav {
	border: 0 !important;
	border-width: 0 !important;
}

.p-tabview .p-tabview-nav li .p-tabview-nav-link {
	background: transparent !important;
}

.p-tabview-nav-content::after {
	content: "";
	display: block;
	height: 3px;
	background-image: url("/assets/img/eventos/linea.png");
	width: 100%;
}

.p-tabview-nav > .p-tabview-header:not(.p-highlight) > .p-tabview-nav-link {
	border: 0 !important;
	border-width: 0 !important;
	background: transparent !important;
}

.p-tabview-nav > .p-tabview-header.p-highlight > .p-tabview-nav-link {
	border: solid #84dc16 !important;
	border-width: 0 0 2px 0 !important;
	border-color: transparent transparent #84dc16 transparent !important;
	color: #84dc16 !important;
}

/*
.p-tabview .p-tabview-nav li .p-tabview-nav-link {
    z-index: 2 !important;
    border: 0 !important;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border: solid !important;
    border-width: 0 0 2px 0 !important;
}*/
.p-card {
	position: relative;
	z-index: 2;
}

.p-card .p-card-content,
.p-card .p-card-body {
	padding-bottom: 0 !important;
}

.p-tabview .p-tabview-panels,
.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > tr,
.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table > .p-datatable-thead > tr > th {
	background: transparent !important;
}

.tablaCreadoresEvento > .p-datatable-wrapper {
	/* background-image: url('/assets/img/eventos/marco-tabla.png'); */
	background-repeat: no-repeat;
	background-size: 100% 100%;
	padding-bottom: 100px;
}

.tablaCreadoresEvento {
	mix-blend-mode: screen;
	position: relative;
	z-index: 1;
	background-image: url("/assets/img/eventos/footer-tabla.jpg") !important;
	background-repeat: no-repeat !important;
	background-size: contain !important;
	background-position: bottom !important;
	display: flex;
	justify-content: center !important;
	flex-direction: column;
}

.tablaCreadoresEvento > .p-datatable-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #000000 !important;
	border: none !important;
	padding-bottom: 160px !important;
}

.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody,
.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table > .p-datatable-thead > tr > th {
	background-color: #000000 !important;
}

.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > tr > td,
.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table > .p-datatable-thead > tr > th {
	border: none !important;
}

.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > tr {
	background-image: url("/assets/img/eventos/divisor-fila.png") !important;
	background-repeat: repeat-x !important;
	background-size: contain !important;
}

.p-progress-spinner {
	z-index: 3 !important;
}

.tablaCreadoresEvento > .p-datatable-wrapper > .p-datatable-table {
	mix-blend-mode: screen !important;
	width: 90%;
	margin: 0 auto;
	/* background-image: url('/assets/img/eventos/marco-tabla.png'); */
	background-repeat: no-repeat;
	background-size: contain;
}

.p-card-body {
	padding-left: 0 !important;
	padding-right: 0 !important;
}

@media (max-width: 500px) {
	.descripcion > .container {
		justify-content: start !important;
		padding: 10px 10px 48px 10px !important;
	}
}

@media (max-width: 450px) {
	.clasificacion > .imgFondo {
		width: 95%;
	}

	.descripcion,
	.reglas,
	.progreso {
		background-size: contain !important;
		min-width: 100% !important;
		padding: 10px 10px 48px 10px !important;
	}
}

@media (max-width: 300px) {
	.clasificacion > .imgFondo {
		width: 99%;
	}

	.descripcion {
		padding: 6px 10px 48px 10px !important;
	}

	.reglas > h2,
	.progreso > h2 {
		margin-top: 0 !important;
	}
}

@media (max-width: 895px) {
	.containerC > .tabla-fondo-header {
		margin-top: 500px !important;
	}

	.containerC > .clasificacion > .imgFondo {
		height: 318px;
	}

	.containerC > .clasificacion.pos-Oro > .imgFondo {
		height: 464px;
	}
}

@media (max-width: 450px) {
	.containerC > .clasificacion > .imgFondo {
		width: 250px;
		height: 250px !important;
	}

	.containerC > .clasificacion > .imgProfile {
		width: 100px !important;
		height: 100px !important;
	}

	.containerC > .clasificacion > .labelNombre {
		top: 55px !important;
	}

	.containerC > .clasificacion.pos-Oro {
		position: relative;
		top: -125px;
	}

	.containerC > .clasificacion.pos-Oro > .labelNombre {
		top: 57px !important;
	}

	.containerC > .clasificacion.pos-Cobre {
		position: relative;
		top: -255px;
	}

	.grupos.grupos3 > .B {
		left: 1px !important;
	}
}
</style>

<style scoped>
.video-container {
	position: fixed;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: 1;
}

.video-container2 {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0 !important;
	background-size: cover;
	left: 0 !important;
}

.tabla-fondo-header {
	top: 0 !important;
	left: 0 !important;
	width: max-content !important;
	height: max-content !important;
	transform: none !important;
	z-index: 0;
	background-size: cover;
	margin-top: 100px;
}

video {
	max-width: 100%;
	max-height: 100%;
	width: 800px;
	height: 800px;
	position: absolute;
	top: 50%;
	left: 50vw;
	transform: translate(-50%, -50%);
}

.evento {
	margin-top: 55px;
}

.evento > * {
	background: transparent !important;
	/* font-family: 'planet-gamers'; */
}

.descripcion {
	background-image: url("/assets/img/eventos/descripcion.png");
	background-repeat: no-repeat;
	background-size: cover;
	width: 400px;
	height: 200px;
	padding: 41px 16px 47px 25px;
}

.descripcion > .container {
	font-size: 19px;
	overflow-x: auto;
	height: 100%;
	width: 100%;
	/*  display: flex; */
	justify-content: center;
	flex-direction: column;
	text-align: center;
	text-transform: uppercase;
}

.reglas,
.progreso {
	background-image: url("/assets/img/eventos/reglas.png");
	background-repeat: no-repeat;
	background-size: cover;
	width: 100%;
	height: auto;
	max-width: 400px;
	max-height: 200px;
	min-height: 200px;
	min-width: 400px;
	padding: 12px;
}

.item-regla {
	background-image: url("/assets/img/eventos/punto-lista.png");
	background-repeat: no-repeat;
	background-size: contain;
	width: 60px;
	height: 30px;
}

.barra-progreso {
	text-align: center;
}

.barra-roja {
	background-image: url("/assets/img/eventos/fluido-rojo.png");
	background-repeat: no-repeat;
	background-size: cover;
	border-bottom-left-radius: 12px;
	border-top-left-radius: 12px;
}

.barra-verde {
	background-image: url("/assets/img/eventos/fluido-verde.png");
	background-repeat: no-repeat;
	background-size: cover;
	border-radius: 12px;
}

[class*="puesto"] {
	width: 300px;
	height: 453px;
	background-repeat: no-repeat;
	background-size: contain;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-items: end;
}

.imagen {
	height: 167px;
}

.puesto1 {
	background-image: url("/assets/img/eventos/premio1-fondo.png");
}

.puesto1 > .titulo > .fondo {
	background-image: url("/assets/img/eventos/premio1-titulo.png");
}

.puesto2 {
	background-image: url("/assets/img/eventos/premio2-fondo.png");
}

.puesto2 > .titulo > .fondo {
	background-image: url("/assets/img/eventos/premio2-titulo.png");
}

.puesto3 {
	background-image: url("/assets/img/eventos/premio3-fondo.png");
}

.puesto3 > .titulo > .fondo {
	background-image: url("/assets/img/eventos/premio3-titulo.png");
}

.titulo {
	justify-items: end;
	align-items: end;
}

[class*="puesto"] > .titulo > .fondo {
	background-size: cover;
	background-repeat: no-repeat;
	width: max-content;
	padding: 19px 44px 12px 44px;
	top: -13px;
	float: right;
	position: relative;
}

.descripcion-premio {
	background-image: url("/assets/img/eventos/descripcion-premio.png");
	background-repeat: no-repeat;
	background-size: contain;
	height: 100%;
	overflow: auto;
}

.grupos {
	background-repeat: no-repeat;
	background-size: contain;
	height: 60px;
	width: 600px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 25px;
	padding-right: 35px;
}

.grupos.grupos3 {
	background-image: url("/assets/img/eventos/grupos3.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	height: 60px;
	width: 600px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 25px;
}

.grupos.grupos3 > .todos {
	padding-left: 25px;
}

.grupos > * {
	position: relative;
	cursor: pointer;
}

.grupos > .todos {
	padding-left: 10px;
}

.grupos > .A {
	left: -9px;
}

.grupos.grupos3 > .A {
	left: 18px;
}

.grupos > .B-C {
	left: 20px;
}

.grupos > .B {
	left: -2px;
}

.grupos.grupos3 > .B {
	left: 5px;
}

.imgPremio {
	height: 167px !important;
	width: 167px !important;
}

@media (max-width: 739px) {
	.imgPremio {
		height: 100%;
	}
}

@media (max-width: 988px) {
	.containerC > .clasificacion {
		width: 32% !important;
	}

	.containerC > .tabla-fondo-header {
		margin-top: 180px;
	}
}

@media (max-width: 895px) {
	.containerC {
		flex-direction: column;
		align-items: center;
	}
}

@media (max-width: 600px) {
	.grupos {
		width: 100%;
		align-items: start !important;
		padding-top: 10px !important;
		font-size: 20px !important;
		padding-left: 2%;
		padding-right: 16px;
		/* gap: 23.3%; */
	}

	.grupos.grupos3 {
		width: 100%;
		align-items: center !important;
		padding-top: 0 !important;
		font-size: 25px !important;
		padding-left: 2.4%;
		padding-right: 26.6px;
	}

	.grupos > .todos {
		padding-left: 5px !important;
		padding-right: 0;
	}

	.grupos > .A {
		left: -6px !important;
	}

	.grupos.grupos3 > .A {
		left: 11px !important;
	}

	.grupos > .B-C {
		left: 15px !important;
	}
}

@media (max-width: 510px) {
	.grupos > .B-C {
		left: 20px !important;
	}

	.grupos > .A {
		left: -11px !important;
	}
}

@media (max-width: 470px) {
	.grupos {
		width: 100%;
		align-items: start !important;
		padding-top: 7px !important;
		font-size: 18px !important;
		padding-left: 2%;
		padding-right: 16px;
		/* gap: 23.3%; */
	}

	.grupos > .todos {
		padding-left: 0 !important;
		padding-right: 0;
	}

	.grupos.grupos3 {
		font-size: 18px !important;
		padding-left: 4%;
		padding-right: 20px;
	}

	.grupos > .B-C {
		left: 11px !important;
	}

	.grupos > .A {
		padding-left: 5px;
		padding-right: 5px;
	}
}

@media (max-width: 400px) {
	.grupos {
		width: 100%;
		align-items: start !important;
		padding-top: 6px !important;
		font-size: 16px !important;
		padding-left: 2%;
		padding-right: 13px;
		/* gap: 23.3%; */
	}

	.grupos > * {
		left: 0 !important;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.grupos > .A {
		left: -5px !important;
		padding-left: 5px;
		padding-right: 5px;
	}

	.grupos.grupos3 > .A {
		left: 6px !important;
	}
}

@media (max-width: 365px) {
	.grupos {
		width: 100%;
		align-items: start !important;
		padding-top: 6px !important;
		font-size: 14px !important;
		padding-left: 2%;
		padding-right: 13px;
		/* gap: 23.3%; */
	}

	.grupos > * {
		left: 0 !important;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.grupos > .B-C {
		left: 14px !important;
	}
}

@media (max-width: 325px) {
	.grupos.grupos3 > .todos {
		left: -9px !important;
	}

	.grupos > .B-C {
		left: 17px !important;
	}
}

@media (max-width: 310px) {
	.grupos {
		width: 100%;
		align-items: start !important;
		padding-top: 3px !important;
		font-size: 14px !important;
		padding-left: 0;
		padding-right: 10px;
		/* gap: 23.3%; */
	}

	.grupos.grupos3 {
		font-size: 15px !important;
		padding-left: 2%;
		background-size: contain !important;
		align-items: start !important;
		padding-right: 11px;
		padding-top: 10px !important;
	}

	.grupos > * {
		left: 0 !important;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.grupos.grupos3 > .todos {
		left: 2px !important;
	}

	.grupos > .B-C {
		left: 8px !important;
	}
}

@media (max-width: 290px) {
	.grupos {
		width: 100%;
		align-items: start !important;
		padding-top: 3px !important;
		font-size: 14px !important;
		padding-left: 0;
		padding-right: 8px;
	}

	.grupos > * {
		left: 0 !important;
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.grupos > .A {
		padding-right: 5px;
	}
}

.evento .p-fieldset-legend-text {
	color: var(--primary-color) !important;
}

.p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler {
	color: var(--primary-color);
}

.text-900 {
	color: white !important;
}

.p-column-title {
	color: var(--primary-color) !important;
}

.p-datatable .p-column-header-content {
	color: var(--primary-color) !important;
}

.p-fieldset {
	border: 1px solid var(--primary-color);
}

.p-fieldset .p-fieldset-legend {
	border: 1px solid var(--primary-color);
}

.p-tabview-nav-container {
	display: flex;
	justify-content: center;
}
</style>
