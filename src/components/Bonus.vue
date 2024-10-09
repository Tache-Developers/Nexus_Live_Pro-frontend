<template>
	<div>
		<Toast />
		<div class="usuario" v-if="!admin">
			<PerfilUsuario />
			<Panel class="Bonus">
				<template #header>
					<div class="flex items-center gap-2 flex-end w-full justify-content-center">
						<img src="/assets/img/perfil/iconos/bonus.png" height="170px" alt="Bonus" />
					</div>
				</template>
				<TabView :scrollable="true" class="tabBonusUsuario">
					<TabPanel v-if="configBonus.bonus_generales == true" :headerClass="'tab-primero'">
						<template #header>
							<div class="flex align-items-center gap-2">
								<Avatar icon="pi pi-filter-slash" shape="circle" size="32px" />
								<span class="font-bold white-space-nowrap">TODOS</span>
							</div>
						</template>
						<DataTable class="bonus-usuario" :value="tablaBonus" tableStyle="min-width: 100%">
							<Column field="nivel" header="Nivel 👑" class="font-gamers">
								<template #body="slotProps">
									{{ slotProps.data.exclusivo ? "Exclusivo" : slotProps.data.nivel }}
								</template>
							</Column>
							<Column field="dias" header="Dias" class="font-gamers">
								<template #body="slotProps">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.dias, slotProps.data.dias)"
										v-model="estadisticas.dias"
										:valueTemplate="slotProps.data.dias.toString()"
										readonly
										:max="validarKnob(estadisticas.dias, slotProps.data.dias)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="horas" header="Horas" class="font-gamers">
								<template #body="props">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.horas, props.data.horas)"
										v-model="estadisticas.horas"
										:valueTemplate="props.data.horas.toString()"
										readonly
										:max="validarKnob(estadisticas.horas, props.data.horas)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="meta" header="Diamantes" headerStyle="width: 19rem;" class="font-gamers">
								<template #body="props">
									{{ props.data.meta == 0 ? "" : props.data.meta.toLocaleString() }}
									<div class="container flex flex-column gap-2">
										<div class="barra-progreso-horas text-center">
											<div class="diamante" v-if="calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] == 100" />
											<div
												:class="'progreso static ' + calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[1]"
												:style="{ width: calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] + '%' }"
											/>
											<p class="m-0 w-full">{{ calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] }}%</p>
										</div>
									</div>
								</template>
							</Column>
							<Column field="ganancia" header="Ganancia" class="font-gamers" />
							<Column field="bonificacion" header="Bonificación" class="font-gamers" />
							<Column header="Estado" class="font-gamers">
								<template #body="slotProps">
									<div
										class="aplica color-rojo"
										v-if="yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[0]"
									>
										{{ yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[1] }}
									</div>
									<div
										class="aplica cursor-pointer color-verde"
										v-tooltip.top="'Clic para reclamar el bono'"
										@click="reclamarBono(slotProps.data._id)"
										v-else-if="
											estadisticas.dias >= slotProps.data.dias &&
											estadisticas.horas >= slotProps.data.horas &&
											estadisticas.diamantes >= slotProps.data.meta
										"
									>
										Reclamar
									</div>
									<div class="aplica color-rojo" v-else>No aplica</div>
								</template>
							</Column>
						</DataTable>
					</TabPanel>
					<TabPanel v-if="store.getUsuario().creator_type == 'Rookie' && configBonus.bonus_categoria == true">
						<template #header>
							<div class="flex align-items-center gap-2">
								<Avatar image="/assets/img/categorias/rookie.png" class="categoria" />
								<span class="font-bold white-space-nowrap">Rookie</span>
							</div>
						</template>
						<DataTable
							class="bonus-usuario"
							sortField="exclusivo"
							:sortOrder="-1"
							:value="bonusByCategoria('Rookie')"
							tableStyle="min-width: 100%"
						>
							<Column field="exclusivo" header="Exclusivo" class="font-gamers">
								<template #body="props">
									{{ props.data.exclusivo ? "Sí" : "No" }}
								</template>
							</Column>
							<Column field="dias" header="Dias" class="font-gamers">
								<template #body="slotProps">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.dias, slotProps.data.dias)"
										v-model="estadisticas.dias"
										:valueTemplate="slotProps.data.dias.toString()"
										readonly
										:max="validarKnob(estadisticas.dias, slotProps.data.dias)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="horas" header="Horas" class="font-gamers">
								<template #body="props">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.horas, props.data.horas)"
										v-model="estadisticas.horas"
										:valueTemplate="props.data.horas.toString()"
										readonly
										:max="validarKnob(estadisticas.horas, props.data.horas)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="meta" header="Diamantes" headerStyle="width: 19rem;" class="font-gamers">
								<template #body="props">
									{{ props.data.meta == 0 ? "" : props.data.meta.toLocaleString() }}
									<div class="container flex flex-column gap-2">
										<div class="barra-progreso-horas text-center">
											<div class="diamante" v-if="calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] == 100" />
											<div
												:class="'progreso static ' + calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[1]"
												:style="{ width: calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] + '%' }"
											/>
											<p class="m-0 w-full">{{ calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] }}%</p>
										</div>
									</div>
								</template>
							</Column>
							<Column field="ganancia" header="Ganancia" class="font-gamers" />
							<Column field="bonificacion" header="Bonificación" class="font-gamers" />
							<Column header="Estado" class="font-gamers">
								<template #body="slotProps">
									<div
										class="aplica color-rojo"
										v-if="yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[0]"
									>
										{{ yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[1] }}
									</div>
									<div
										class="aplica cursor-pointer color-verde"
										v-tooltip.top="'Clic para reclamar el bono'"
										@click="reclamarBono(slotProps.data._id)"
										v-else-if="
											estadisticas.dias >= slotProps.data.dias &&
											estadisticas.horas >= slotProps.data.horas &&
											estadisticas.diamantes >= slotProps.data.meta
										"
									>
										Reclamar
									</div>
									<div class="aplica color-rojo" v-else>No aplica</div>
								</template>
							</Column>
						</DataTable>
					</TabPanel>
					<TabPanel v-else-if="store.getUsuario().creator_type == 'Veteran' && configBonus.bonus_categoria == true">
						<template #header>
							<div class="flex align-items-center gap-2">
								<Avatar image="/assets/img/categorias/veterano.png" class="categoria" />
								<span class="font-bold white-space-nowrap">Veteran</span>
							</div>
						</template>
						<DataTable
							class="bonus-usuario"
							sortField="exclusivo"
							:sortOrder="-1"
							:value="bonusByCategoria('Veteran')"
							tableStyle="min-width: 100%"
						>
							<Column field="exclusivo" header="Exclusivo" class="font-gamers">
								<template #body="props">
									{{ props.data.exclusivo ? "Sí" : "No" }}
								</template>
							</Column>
							<Column field="dias" header="Dias" class="font-gamers">
								<template #body="slotProps">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.dias, slotProps.data.dias)"
										v-model="estadisticas.dias"
										:valueTemplate="slotProps.data.dias.toString()"
										readonly
										:max="validarKnob(estadisticas.dias, slotProps.data.dias)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="horas" header="Horas" class="font-gamers">
								<template #body="props">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.horas, props.data.horas)"
										v-model="estadisticas.horas"
										:valueTemplate="props.data.horas.toString()"
										readonly
										:max="validarKnob(estadisticas.horas, props.data.horas)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="meta" header="Diamantes" headerStyle="width: 19rem;" class="font-gamers">
								<template #body="props">
									{{ props.data.meta == 0 ? "" : props.data.meta.toLocaleString() }}
									<div class="container flex flex-column gap-2">
										<div class="barra-progreso-horas text-center">
											<div class="diamante" v-if="calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] == 100" />
											<div
												:class="'progreso static ' + calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[1]"
												:style="{ width: calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] + '%' }"
											/>
											<p class="m-0 w-full">{{ calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] }}%</p>
										</div>
									</div>
								</template>
							</Column>
							<Column field="ganancia" header="Ganancia" class="font-gamers" />
							<Column field="bonificacion" header="Bonificación" class="font-gamers" />
							<Column header="Estado" class="font-gamers">
								<template #body="slotProps">
									<div
										class="aplica color-rojo"
										v-if="yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[0]"
									>
										{{ yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[1] }}
									</div>
									<div
										class="aplica cursor-pointer color-verde"
										v-tooltip.top="'Clic para reclamar el bono'"
										@click="reclamarBono(slotProps.data._id)"
										v-else-if="
											estadisticas.dias >= slotProps.data.dias &&
											estadisticas.horas >= slotProps.data.horas &&
											estadisticas.diamantes >= slotProps.data.meta
										"
									>
										Reclamar
									</div>
									<div class="aplica color-rojo" v-else>No aplica</div>
								</template>
							</Column>
						</DataTable>
					</TabPanel>
					<TabPanel v-else-if="store.getUsuario().creator_type == 'Pro' && configBonus.bonus_categoria == true">
						<template #header>
							<div class="flex align-items-center gap-2">
								<Avatar image="/assets/img/categorias/pro.png" class="categoria" />
								<span class="font-bold white-space-nowrap">Pro</span>
							</div>
						</template>
						<DataTable
							class="bonus-usuario"
							sortField="exclusivo"
							:sortOrder="-1"
							:value="bonusByCategoria('Pro')"
							tableStyle="min-width: 100%"
						>
							<Column field="exclusivo" header="Exclusivo" class="font-gamers">
								<template #body="props">
									{{ props.data.exclusivo ? "Sí" : "No" }}
								</template>
							</Column>
							<Column field="dias" header="Dias" class="font-gamers">
								<template #body="slotProps">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.dias, slotProps.data.dias)"
										v-model="estadisticas.dias"
										:valueTemplate="slotProps.data.dias.toString()"
										readonly
										:max="validarKnob(estadisticas.dias, slotProps.data.dias)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="horas" header="Horas" class="font-gamers">
								<template #body="props">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.horas, props.data.horas)"
										v-model="estadisticas.horas"
										:valueTemplate="props.data.horas.toString()"
										readonly
										:max="validarKnob(estadisticas.horas, props.data.horas)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="meta" header="Diamantes" headerStyle="width: 19rem;" class="font-gamers">
								<template #body="props">
									{{ props.data.meta == 0 ? "" : props.data.meta.toLocaleString() }}
									<div class="container flex flex-column gap-2">
										<div class="barra-progreso-horas text-center">
											<div class="diamante" v-if="calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] == 100" />
											<div
												:class="'progreso static ' + calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[1]"
												:style="{ width: calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] + '%' }"
											/>
											<p class="m-0 w-full">{{ calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] }}%</p>
										</div>
									</div>
								</template>
							</Column>
							<Column field="ganancia" header="Ganancia" class="font-gamers" />
							<Column field="bonificacion" header="Bonificación" class="font-gamers" />
							<Column header="Estado" class="font-gamers">
								<template #body="slotProps">
									<div
										class="aplica color-rojo"
										v-if="yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[0]"
									>
										{{ yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[1] }}
									</div>
									<div
										class="aplica cursor-pointer color-verde"
										v-tooltip.top="'Clic para reclamar el bono'"
										@click="reclamarBono(slotProps.data._id)"
										v-else-if="
											estadisticas.dias >= slotProps.data.dias &&
											estadisticas.horas >= slotProps.data.horas &&
											estadisticas.diamantes >= slotProps.data.meta
										"
									>
										Reclamar
									</div>
									<div class="aplica color-rojo" v-else>No aplica</div>
								</template>
							</Column>
						</DataTable>
					</TabPanel>
					<TabPanel v-else-if="store.getUsuario().creator_type == 'Pro+' && configBonus.bonus_categoria == true">
						<template #header>
							<div class="flex align-items-center gap-2">
								<Avatar image="/assets/img/categorias/pro-plus.png" class="categoria" />
								<span class="font-bold white-space-nowrap">Pro+</span>
							</div>
						</template>
						<DataTable
							class="bonus-usuario"
							sortField="exclusivo"
							:sortOrder="-1"
							:value="bonusByCategoria('Pro+')"
							tableStyle="min-width: 100%"
						>
							<Column field="exclusivo" header="Exclusivo" class="font-gamers">
								<template #body="props">
									{{ props.data.exclusivo ? "Sí" : "No" }}
								</template>
							</Column>
							<Column field="dias" header="Dias" class="font-gamers">
								<template #body="slotProps">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.dias, slotProps.data.dias)"
										v-model="estadisticas.dias"
										:valueTemplate="slotProps.data.dias.toString()"
										readonly
										:max="validarKnob(estadisticas.dias, slotProps.data.dias)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="horas" header="Horas" class="font-gamers">
								<template #body="props">
									<Knob
										:valueColor="validarCompletoColor(estadisticas.horas, props.data.horas)"
										v-model="estadisticas.horas"
										:valueTemplate="props.data.horas.toString()"
										readonly
										:max="validarKnob(estadisticas.horas, props.data.horas)"
										:size="70"
									/>
								</template>
							</Column>
							<Column field="meta" header="Diamantes" headerStyle="width: 19rem;" class="font-gamers">
								<template #body="props">
									{{ props.data.meta == 0 ? "" : props.data.meta.toLocaleString() }}
									<div class="container flex flex-column gap-2">
										<div class="barra-progreso-horas text-center">
											<div class="diamante" v-if="calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] == 100" />
											<div
												:class="'progreso static ' + calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[1]"
												:style="{ width: calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] + '%' }"
											/>
											<p class="m-0 w-full">{{ calcularProgresoDiamantes(props.data.meta, estadisticas.diamantes)[0] }}%</p>
										</div>
									</div>
								</template>
							</Column>
							<Column field="ganancia" header="Ganancia" class="font-gamers" />
							<Column field="bonificacion" header="Bonificación" class="font-gamers" />
							<Column header="Estado" class="font-gamers">
								<template #body="slotProps">
									<div
										class="aplica color-rojo"
										v-if="yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[0]"
									>
										{{ yaReclamaron(slotProps.data._id, slotProps.data.exclusivo, slotProps.data.categorias)[1] }}
									</div>
									<div
										class="aplica cursor-pointer color-verde"
										v-tooltip.top="'Clic para reclamar el bono'"
										@click="reclamarBono(slotProps.data._id)"
										v-else-if="
											estadisticas.dias >= slotProps.data.dias &&
											estadisticas.horas >= slotProps.data.horas &&
											estadisticas.diamantes >= slotProps.data.meta
										"
									>
										Reclamar
									</div>
									<div class="aplica color-rojo" v-else>No aplica</div>
								</template>
							</Column>
						</DataTable>
					</TabPanel>
				</TabView>
			</Panel>
		</div>
		<Panel class="Bonus" v-else>
			<template #header>
				<div class="flex align-items-center gap-2 flex-wrap flex-end w-full justify-content-between">
					<h1 class="m-0">Bonus</h1>
					<h3 class="m-0 p-0 text-white">Total: ${{ totalPagar }}</h3>
					<div class="flex flex-wrap gap-2">
						<Button
							v-tooltip.top="configBonus.msgGen"
							:icon="configBonus.bonus_generales == true ? 'pi pi-unlock' : 'pi pi-lock-open'"
							label="Generales"
							@click="cambiarConfigGenerales"
							:severity="configBonus.bonus_generales == true ? 'success' : 'danger'"
						/>
						<Button
							v-tooltip.top="configBonus.msgCat"
							:icon="configBonus.bonus_categoria == true ? 'pi pi-unlock' : 'pi pi-lock-open'"
							label="Categorías"
							@click="cambiarConfigCategoria"
							:severity="configBonus.bonus_categoria == true ? 'success' : 'danger'"
						/>
						<Button icon="pi pi-percentage" :label="'Multiplicador x' + multiplicador" @click="modalMultiplicador = true" />
						<Button
							icon="pi pi-plus"
							v-if="configBonus.bonus_categoria"
							severity="warning"
							label="Por categoría"
							@click="modalBonusCategoria = true"
						/>
						<Button icon="pi pi-plus" v-if="configBonus.bonus_generales" label="Añadir" @click="modalBonus = true"></Button>
					</div>
				</div>
			</template>
			<TabView :scrollable="true" class="tabBonus" v-model:activeIndex="activePanel">
				<TabPanel v-if="configBonus.bonus_generales == true" :headerClass="'tab-primero'">
					<template #header>
						<div class="flex align-items-center gap-2">
							<Avatar icon="pi pi-filter-slash" shape="circle" size="32px" />
							<span class="font-bold white-space-nowrap">TODOS</span>
						</div>
					</template>
					<DataTable :value="tablaBonus" tableStyle="min-width: 100%" sortField="nivel" :sortOrder="1">
						<Column field="nivel" header="Nivel 👑">
							<template #body="slotProps">
								{{ slotProps.data.exclusivo ? "Exclusivo" : slotProps.data.nivel }}
							</template>
						</Column>
						<Column field="dias" header="Dias"></Column>
						<Column field="horas" header="Horas"></Column>
						<Column field="meta" header="Diamantes">
							<template #body="slotProps">
								{{ slotProps.data.meta == 0 ? "X" : slotProps.data.meta }}
							</template>
						</Column>
						<Column field="ganancia" header="Ganancia"></Column>
						<Column field="bonificacion" header="Bonificación"></Column>
						<Column>
							<template #body="slotProps">
								<div class="flex flex-wrap gap-2">
									<Button icon="pi pi-pencil" outlined rounded severity="warning" @click="editarBonusDialog(slotProps.data, 'Bonus')" />
									<Button
										icon="pi pi-eye"
										v-tooltip.top="'¿Quién cumple el bonus?'"
										outlined
										rounded
										severity="info"
										@click="verQuienCumple(slotProps.data._id)"
									/>
									<Button
										icon="pi pi-trash"
										outlined
										rounded
										severity="danger"
										@click="comfirmDelete(slotProps.data._id, slotProps.data.nivel)"
									/>
								</div>
							</template>
						</Column>
					</DataTable>
				</TabPanel>
				<TabPanel v-if="!categoriasMezcladas.includes('Rookie') && configBonus.bonus_categoria == true">
					<template #header>
						<div class="flex align-items-center gap-2">
							<Avatar image="/assets/img/categorias/rookie.png" class="categoria" />
							<span class="font-bold white-space-nowrap">Rookie</span>
						</div>
					</template>
					<DataTable :value="bonusByCategoria('Rookie')" tableStyle="min-width: 100%" sortField="exclusivo" :sortOrder="1">
						<Column field="exclusivo" header="Exclusivo">
							<template #body="props">
								{{ props.data.exclusivo ? "Sí" : "No" }}
							</template>
						</Column>
						<Column field="dias" header="Días" />
						<Column field="horas" header="Horas" />
						<Column field="meta" header="Diamantes">
							<template #body="slotProps">
								{{ slotProps.data.meta == 0 ? "X" : slotProps.data.meta }}
							</template>
						</Column>
						<Column field="ganancia" header="Ganancia" />
						<Column field="bonificacion" header="Bonificación" />
						<Column>
							<template #body="slotProps">
								<div class="flex flex-wrap gap-2">
									<Button
										icon="pi pi-pencil"
										outlined
										rounded
										severity="warning"
										@click="editarBonusDialog(slotProps.data, 'BonusCategoria')"
									/>
									<Button
										icon="pi pi-eye"
										v-tooltip.top="'¿Quién cumple el bonus?'"
										outlined
										rounded
										severity="info"
										@click="verQuienCumple(slotProps.data._id)"
									/>
									<Button icon="pi pi-trash" outlined rounded severity="danger" @click="comfirmDelete(slotProps.data._id)" />
								</div>
							</template>
						</Column>
					</DataTable>
				</TabPanel>
				<TabPanel v-if="!categoriasMezcladas.includes('Veteran') && configBonus.bonus_categoria == true">
					<template #header>
						<div class="flex align-items-center gap-2">
							<Avatar image="/assets/img/categorias/veterano.png" class="categoria" />
							<span class="font-bold white-space-nowrap">Veteran</span>
						</div>
					</template>
					<DataTable :value="bonusByCategoria('Veteran')" tableStyle="min-width: 100%">
						<Column field="exclusivo" header="Exclusivo">
							<template #body="props">
								{{ props.data.exclusivo ? "Sí" : "No" }}
							</template>
						</Column>
						<Column field="dias" header="Días" />
						<Column field="horas" header="Horas" />
						<Column field="meta" header="Diamantes">
							<template #body="slotProps">
								{{ slotProps.data.meta == 0 ? "X" : slotProps.data.meta }}
							</template>
						</Column>
						<Column field="ganancia" header="Ganancia" />
						<Column field="bonificacion" header="Bonificación" />
						<Column>
							<template #body="slotProps">
								<div class="flex flex-wrap gap-2">
									<Button
										icon="pi pi-pencil"
										outlined
										rounded
										severity="warning"
										@click="editarBonusDialog(slotProps.data, 'BonusCategoria')"
									/>
									<Button
										icon="pi pi-eye"
										v-tooltip.top="'¿Quién cumple el bonus?'"
										outlined
										rounded
										severity="info"
										@click="verQuienCumple(slotProps.data._id)"
									/>
									<Button icon="pi pi-trash" outlined rounded severity="danger" @click="comfirmDelete(slotProps.data._id)" />
								</div>
							</template>
						</Column>
					</DataTable>
				</TabPanel>
				<TabPanel v-if="!categoriasMezcladas.includes('Pro') && configBonus.bonus_categoria == true">
					<template #header>
						<div class="flex align-items-center gap-2">
							<Avatar image="/assets/img/categorias/pro.png" class="categoria" />
							<span class="font-bold white-space-nowrap">Pro</span>
						</div>
					</template>
					<DataTable :value="bonusByCategoria('Pro')" tableStyle="min-width: 100%">
						<Column field="exclusivo" header="Exclusivo">
							<template #body="props">
								{{ props.data.exclusivo ? "Sí" : "No" }}
							</template>
						</Column>
						<Column field="dias" header="Días" />
						<Column field="horas" header="Horas" />
						<Column field="meta" header="Diamantes">
							<template #body="slotProps">
								{{ slotProps.data.meta == 0 ? "X" : slotProps.data.meta }}
							</template>
						</Column>
						<Column field="ganancia" header="Ganancia" />
						<Column field="bonificacion" header="Bonificación" />
						<Column>
							<template #body="slotProps">
								<div class="flex flex-wrap gap-2">
									<Button
										icon="pi pi-pencil"
										outlined
										rounded
										severity="warning"
										@click="editarBonusDialog(slotProps.data, 'BonusCategoria')"
									/>
									<Button
										icon="pi pi-eye"
										v-tooltip.top="'¿Quién cumple el bonus?'"
										outlined
										rounded
										severity="info"
										@click="verQuienCumple(slotProps.data._id)"
									/>
									<Button icon="pi pi-trash" outlined rounded severity="danger" @click="comfirmDelete(slotProps.data._id)" />
								</div>
							</template>
						</Column>
					</DataTable>
				</TabPanel>
				<TabPanel v-if="!categoriasMezcladas.includes('Pro+') && configBonus.bonus_categoria == true">
					<template #header>
						<div class="flex align-items-center gap-2">
							<Avatar image="/assets/img/categorias/pro-plus.png" class="categoria" />
							<span class="font-bold white-space-nowrap">Pro+</span>
						</div>
					</template>
					<DataTable :value="bonusByCategoria('Pro+')" tableStyle="min-width: 100%">
						<Column field="exclusivo" header="Exclusivo">
							<template #body="props">
								{{ props.data.exclusivo ? "Sí" : "No" }}
							</template>
						</Column>
						<Column field="dias" header="Días" />
						<Column field="horas" header="Horas" />
						<Column field="meta" header="Diamantes">
							<template #body="slotProps">
								{{ slotProps.data.meta == 0 ? "X" : slotProps.data.meta }}
							</template>
						</Column>
						<Column field="ganancia" header="Ganancia" />
						<Column field="bonificacion" header="Bonificación" />
						<Column>
							<template #body="slotProps">
								<div class="flex flex-wrap gap-2">
									<Button
										icon="pi pi-pencil"
										outlined
										rounded
										severity="warning"
										@click="editarBonusDialog(slotProps.data, 'BonusCategoria')"
									/>
									<Button
										icon="pi pi-eye"
										v-tooltip.top="'¿Quién cumple el bonus?'"
										outlined
										rounded
										severity="info"
										@click="verQuienCumple(slotProps.data._id)"
									/>
									<Button icon="pi pi-trash" outlined rounded severity="danger" @click="comfirmDelete(slotProps.data._id)" />
								</div>
							</template>
						</Column>
					</DataTable>
				</TabPanel>
				<TabPanel v-if="configBonus.bonus_categoria == true" :headerClass="'tab-ultimo'">
					<template #header>
						<div class="flex align-items-center gap-2">
							<Avatar icon="pi pi-sync" shape="circle" />
							<a class="custom-link"><span class="font-bold white-space-nowrap">Mezclar</span></a>
						</div>
					</template>
					<div class="flex flex-wrap flex-column gap-3 align-items-center justify-content-center">
						<form ref="formMezcla" class="md:col-5 xs:col-11 sm:col-10">
							<h2>Categorías mezcladas</h2>
							<div class="flex flex-column gap-1 mb-2">
								<label for="categorias" class="font-bold block">Categorías</label>
								<MultiSelect
									v-model="paqueteMezclar.categorias"
									id="categorias"
									placeholder="Selecciona las categorías"
									:options="categorias"
								/>
							</div>
							<div class="flex flex-wrap gap-2 justify-content-end">
								<Button label="Reiniciar" @click="reiniciarMezclaCategorias" text severity="warning" />
								<Button label="Mezclar" @click="mezclarCategorias" :disabled="btnBonus" severity="success" />
							</div>
						</form>
						<div class="col-11 xs:col-12">
							<DataTable :value="bonusMezclados" tableStyle="min-width: 100%">
								<Column field="exclusivo" header="Exclusivo">
									<template #body="props">
										{{ props.data.exclusivo ? "Sí" : "No" }}
									</template>
								</Column>
								<Column field="dias" header="Días" />
								<Column field="horas" header="Horas" />
								<Column field="meta" header="Diamantes">
									<template #body="slotProps">
										{{ slotProps.data.meta == 0 ? "X" : slotProps.data.meta }}
									</template>
								</Column>
								<Column field="categorias" header="Categorías">
									<template #body="props">
										{{ props.data.categorias.join(", ") }}
									</template>
								</Column>
								<Column field="ganancia" header="Ganancia" />
								<Column field="bonificacion" header="Bonificación" />
								<Column>
									<template #body="slotProps">
										<div class="flex flex-wrap gap-2">
											<Button
												icon="pi pi-pencil"
												outlined
												rounded
												severity="warning"
												@click="editarBonusDialog(slotProps.data, 'BonusCategoria')"
											/>
											<Button
												icon="pi pi-eye"
												v-tooltip.top="'¿Quién cumple el bonus?'"
												outlined
												rounded
												severity="info"
												@click="verQuienCumple(slotProps.data._id)"
											/>
											<Button icon="pi pi-trash" outlined rounded severity="danger" @click="comfirmDelete(slotProps.data._id)" />
										</div>
									</template>
								</Column>
							</DataTable>
						</div>
					</div>
				</TabPanel>
			</TabView>
		</Panel>
		<Dialog
			v-model:visible="modalBonus"
			header="Crear Bonus"
			:style="{ width: '50rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<form ref="formBonus">
				<div class="flex gap-1 mb-2">
					<Checkbox v-model="paqueteBonus.exclusivo" inputId="exclusivo" name="exclusivo" value="exclusivo" :binary="true" />
					<label for="exclusivo">Exclusivo</label>
				</div>
				<div class="flex flex-column gap-1 mb-2" v-if="!paqueteBonus.exclusivo">
					<label for="nivel" class="font-bold block">Nivel</label>
					<InputText v-model="paqueteBonus.nivel" type="text" id="nivel" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="dias" class="font-bold block">Días</label>
					<InputText v-model="paqueteBonus.dias" type="number" id="dias" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="horas" class="font-bold block">Horas</label>
					<InputText v-model="paqueteBonus.horas" type="number" id="horas" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="meta" class="font-bold block">Diamantes - Meta</label>
					<InputText v-model="paqueteBonus.meta" type="number" id="meta" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="ganancia" class="font-bold block">Ganancia</label>
					<InputText v-model="paqueteBonus.ganancia" type="text" id="ganancia" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="bonificacion" class="font-bold block">Bonificación</label>
					<InputText v-model="paqueteBonus.bonificacion" type="text" id="bonificacion" />
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalBonus = false" text autofocus severity="danger" />
				<Button :label="idEditarBonus == null ? 'Crear' : 'Actualizar'" @click="crearBonus()" :disabled="btnBonus" severity="success" />
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalBonusCategoria"
			header="Crear Bonus"
			:style="{ width: '50rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<form ref="formBonusCategoria">
				<div class="flex gap-1 mb-2">
					<Checkbox v-model="paqueteBonusCategoria.exclusivo" inputId="exclusivo" name="exclusivo" value="exclusivo" :binary="true" />
					<label for="exclusivo">Exclusivo</label>
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="dias" class="font-bold block">Categorías</label>
					<MultiSelect v-model="paqueteBonusCategoria.categorias" placeholder="Selecciona las categorías" :options="categorias" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="dias" class="font-bold block">Días</label>
					<InputText v-model="paqueteBonusCategoria.dias" type="number" id="dias" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="horas" class="font-bold block">Horas</label>
					<InputText v-model="paqueteBonusCategoria.horas" type="number" id="horas" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="meta" class="font-bold block">Diamantes - Meta</label>
					<InputText v-model="paqueteBonusCategoria.meta" type="number" id="meta" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="ganancia" class="font-bold block">Ganancia</label>
					<InputText v-model="paqueteBonusCategoria.ganancia" type="text" id="ganancia" />
				</div>
				<div class="flex flex-column gap-1 mb-2">
					<label for="bonificacion" class="font-bold block">Bonificación</label>
					<InputText v-model="paqueteBonusCategoria.bonificacion" type="text" id="bonificacion" />
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalBonusCategoria = false" text autofocus severity="danger" />
				<Button
					:label="idEditarBonusCategoria == null ? 'Crear' : 'Actualizar'"
					@click="crearBonusCategoria"
					:disabled="btnBonus"
					severity="success"
				/>
			</template>
		</Dialog>
		<Dialog
			v-model:visible="modalMultiplicador"
			header="Multiplicador"
			:style="{ width: '50rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<form ref="formBonus">
				<div class="flex flex-column gap-1 mb-2">
					<label for="nivel" class="font-bold block">Multiplicador</label>
					<InputText v-model="multiplicador" type="number" id="nivel" />
				</div>
			</form>
			<template #footer>
				<Button label="Cancelar" @click="modalMultiplicador = false" text severity="danger" />
				<Button label="Actualizar" :disabled="btnMultiplicador" @click="actualizarMultiplicador()" severity="success" />
			</template>
		</Dialog>
		<Dialog v-model:visible="deleteBonusDialog" :style="{ width: '450px' }" :header="headerBonusDelete" :modal="true" class="p-fluid">
			<div class="d-flex">
				<Button label="Cancelar" severity="info" icon="pi pi-times" text @click="deleteBonusDialog = false" />
				<Button label="Eliminar" severity="danger" icon="pi pi-check" text @click="deleteBonusBd()" />
			</div>
		</Dialog>
		<Dialog
			v-model:visible="modalVerCumplen"
			header="Cumplen Bonus"
			:style="{ width: '54rem' }"
			:breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
			position="top"
			:modal="true"
			:draggable="false"
		>
			<DataTable :value="cumplenBonus" tableStyle="min-width: 100%" sortField="usuario" :sortOrder="1">
				<template #header>
					<div class="flex flex-wrap align-items-center justify-content-center gap-2">
						<span class="text-xl text-900 font-bold">
							{{ cumplenBonus.length }} {{ cumplenBonus.length == 1 ? "creador cumple el bonus" : "creadores cumplen el bonus" }}
						</span>
					</div>
				</template>
				<Column field="usuario" header="Creador" />
				<Column field="creator_type" header="Categoría creador" />
				<Column field="diamantes_mes_actual" header="Diamantes" />
				<Column field="dias_validos_mes_actual" header="Días" />
				<Column field="last_live_duration_mes_actual" header="Horas">
					<template #body="props">
						{{ formatHoras(props.data.last_live_duration_mes_actual) }}
					</template>
				</Column>
			</DataTable>
			<template #footer>
				<Button label="Cerrar" @click="modalVerCumplen = false" text severity="danger" />
			</template>
		</Dialog>
	</div>
</template>
<script>
import axios from "axios";
import { useStoreEvento } from "../store";
import PerfilUsuario from "./Perfil.vue";
export default {
	components: {
		PerfilUsuario,
	},
	data() {
		return {
			admin: false,
			API: import.meta.env.VITE_APP_API,
			usuario_actual: null,
			store: null,
			token: null,
			activePanel: 0,
			reclamandoBonus: false,
			configBonus: {
				bonus_generales: true,
				bonus_categoria: false,
				msgGen: "Desactivar",
				msgCat: "Activar",
			},
			totalPagar: 0,
			multiplicador: 1,
			btnMultiplicador: false,
			modalMultiplicador: false,
			idEditarBonus: null,
			idEditarBonusCategoria: null,
			idEliminarBonusCat: null,
			paqueteBonus: {
				nivel: null,
				dias: null,
				horas: null,
				meta: null,
				ganancia: null,
				bonificacion: null,
				exclusivo: false,
			},
			paqueteBonusCategoria: {
				categorias: [],
				dias: null,
				horas: null,
				meta: null,
				ganancia: null,
				bonificacion: null,
				exclusivo: false,
			},
			paqueteMezclar: {
				categorias: [],
			},
			btnBonus: false,
			headerBonusDelete: null,
			deleteBonusDialog: false,
			deleteBonusID: null,
			tablaBonus: [],
			bonusCategoria: [],
			allBonusCategoria: [],
			cumplenBonus: [],
			bonusMezclados: [],
			categoriasMezcladas: [],
			usuario: null,
			estadisticas: {
				dias: null,
				diamantes: null,
				horas: null,
			},
			modalBonus: false,
			modalBonusCategoria: false,
			modalVerCumplen: false,
			idsMisPremios: [],
			categorias: ["Rookie", "Pro", "Pro+", "Veteran"],
		};
	},
	methods: {
		editarBonusDialog(data, tipo = null) {
			if (tipo == "Bonus") {
				this.idEditarBonus = data._id;
				delete data._id;
				delete data.__v;
				this.paqueteBonus = { ...data };
				this.modalBonus = true;
			} else if (tipo == "BonusCategoria") {
				const bonusCat = { ...this.allBonusCategoria.filter((bono) => bono._id == data._id)[0] };
				this.idEditarBonusCategoria = data._id;
				if (bonusCat != null) {
					delete bonusCat._id;
					delete bonusCat.__v;
					this.paqueteBonusCategoria = { ...bonusCat };
					this.modalBonusCategoria = true;
				}
			}
		},
		bonusByCategoria(categoria = null) {
			if (categoria != null) {
				const indexCat = this.bonusCategoria.findIndex((bonus) => bonus._id == categoria);
				return indexCat != -1 ? this.bonusCategoria[indexCat].bonus : [];
			}
			return [];
		},
		async verQuienCumple(idBonus = null) {
			if (idBonus != null) {
				await axios
					.get(`${this.API}/usuario/cumplen/bonus/${idBonus}`, this.token)
					.then((resp) => {
						this.cumplenBonus = resp.data;
						this.modalVerCumplen = true;
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({
									severity: "error",
									summary: "Creadores bonus",
									detail: "No se pudieron obtener los creadores",
									life: 1600,
								});
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		calcularProgresoDiamantes(meta, diamantes) {
			let progreso = Math.floor((100 / meta) * diamantes);
			//NAN cuando la meta es 0, o sea, el bono no es por diamantes
			progreso = isNaN(progreso) ? 100 : progreso;
			//0 - Porcentaje, 1 - animacion barra
			if (progreso >= 100) {
				return [100, "verde"];
			} else if (progreso >= 50 && progreso < 99) {
				return [progreso, "casi"];
			}
			return [progreso, "rojo"];
		},
		validarKnob(horas, horasMeta) {
			if (horas >= horasMeta) {
				return horas;
			}
			return horasMeta;
		},
		validarCompletoColor(horas, horasMeta) {
			const progreso = Math.floor((100 / horasMeta) * horas);
			if (progreso < 50) {
				return "#EE1D52";
			}
			if (progreso >= 50 && progreso < 99) {
				return "#f97316";
			}
			return "var(--primary-color)";
		},
		validarCompletoColorBar(meta, diamantes) {
			const progreso = Math.floor((100 / meta) * diamantes);
			if (progreso < 50) {
				return {
					value: { style: { background: "#ff3d32" } },
				};
			}
			if (progreso >= 50 && progreso < 99) {
				return {
					value: { style: { background: "#f97316" } },
				};
			}
			return {};
		},
		formValid() {
			let valid = true;
			const key = Object.keys(this.paqueteBonus);
			for (const k of key) {
				if (this.paqueteBonus[k] == null) {
					valid = false;
					break;
				}
			}
			if (!valid) {
				this.$toast.add({ severity: "error", summary: "Nuevo evento", detail: "Debes llenar todos los campos", life: 1600 });
			}

			return valid;
		},
		formValidCategoria() {
			let valid = true;
			const key = Object.keys(this.paqueteBonusCategoria);
			for (const k of key) {
				if (this.paqueteBonusCategoria[k] == null) {
					valid = false;
					break;
				}
			}
			if (!valid) {
				this.$toast.add({ severity: "error", summary: "Nuevo bonus", detail: "Debes llenar todos los campos", life: 1600 });
			}

			return valid;
		},
		async crearBonus() {
			if (this.paqueteBonus.exclusivo) {
				this.paqueteBonus.nivel = 0;
				if (this.paqueteBonus.meta == null) {
					this.paqueteBonus.meta = 0;
				}
			} else {
				delete this.paqueteBonus.exclusivo;
			}
			const valid = this.formValid();
			if (valid) {
				this.btnBonus = true;
				this.paqueteBonus.nivel = parseInt(this.paqueteBonus.nivel);
				this.paqueteBonus.horas = parseInt(this.paqueteBonus.horas);
				this.paqueteBonus.meta = parseInt(this.paqueteBonus.meta);
				this.paqueteBonus.dias = parseInt(this.paqueteBonus.dias);
				//Se está creando
				if (this.idEditarBonus == null) {
					await axios
						.post(`${this.API}/bonus/crear`, this.paqueteBonus, this.token)
						.then((resp) => {
							this.obtenerBonus();
							this.getBonosAgrupadosCategoria();
							this.getBonusMezclados();
							this.paqueteBonus = {
								nivel: null,
								dias: null,
								horas: null,
								meta: null,
								ganancia: null,
								bonificacion: null,
								exclusivo: false,
							};
							this.$toast.add({ severity: "success", summary: "Nuevo Bonus", detail: "Creado correctamente!", life: 1600 });
						})
						.catch((error) => {
							switch (error.response.data.statusCode) {
								case 401:
									//Se le termino la sesión
									this.store.clearUser();
									this.$router.push("/login");
									break;
								default:
									this.$toast.add({ severity: "error", summary: "Nuevo Bonus", detail: "Ocurrio un problema inesperado!", life: 1600 });
									console.log("Error: ", error);
									break;
							}
						});
				} else {
					//Se está editando
					await axios
						.put(`${this.API}/bonus/actualizar/${this.idEditarBonus}`, this.paqueteBonus, this.token)
						.then((resp) => {
							if (resp.data.actualizado) {
								this.obtenerBonus();
								this.getBonosAgrupadosCategoria();
								this.getBonusMezclados();
								this.paqueteBonus = {
									nivel: null,
									dias: null,
									horas: null,
									meta: null,
									ganancia: null,
									bonificacion: null,
									exclusivo: false,
								};
								this.idEditarBonus = null;
								this.modalBonus = false;
							}
							this.$toast.add({
								severity: resp.data.actualizado ? "success" : "error",
								summary: "Actualizar bonus",
								detail: resp.data.message,
								life: 1600,
							});
						})
						.catch((error) => {
							switch (error.response.data.statusCode) {
								case 401:
									//Se le termino la sesión
									this.store.clearUser();
									this.$router.push("/login");
									break;
								default:
									this.$toast.add({
										severity: "error",
										summary: "Actualizar bonus",
										detail: "Ocurrió un problema actualizando el bonus",
										life: 1600,
									});
									console.log("Error: ", error);
									break;
							}
						});
				}
				this.btnBonus = false;
			}
		},
		async obtenerBonus() {
			axios
				.get(`${this.API}/bonus`)
				.then((bonus) => {
					this.tablaBonus = bonus.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Nuevo Bonus", detail: "Ocurrio un problema inesperado!", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async actualizarMultiplicador() {
			this.btnMultiplicador = true;
			await axios
				.post(`${this.API}/bonus/multiplicador/${this.multiplicador}`)
				.then(() => {
					this.modalMultiplicador = false;
					this.$toast.add({ severity: "success", summary: "Multiplicador", detail: "Actualizado correctamente!", life: 1600 });
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Multiplicador", detail: "Ocurrio un problema inesperado!", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
			this.btnMultiplicador = false;
		},
		async crearBonusCategoria() {
			if (this.paqueteBonusCategoria.categorias.length > 0) {
				const valid = this.formValidCategoria();
				if (valid) {
					this.btnBonus = true;
					this.paqueteBonusCategoria.dias = parseInt(this.paqueteBonusCategoria.dias);
					this.paqueteBonusCategoria.horas = parseInt(this.paqueteBonusCategoria.horas);
					this.paqueteBonusCategoria.meta = parseInt(this.paqueteBonusCategoria.meta);
					//Se está creando
					if (this.idEditarBonusCategoria == null) {
						await axios
							.post(`${this.API}/bonus-categoria/crear`, this.paqueteBonusCategoria, this.token)
							.then((resp) => {
								if (resp.data.creado) {
									this.getBonusCategorias();
									this.getBonosAgrupadosCategoria();
									this.getBonusMezclados();
									this.$refs.formBonusCategoria.reset();
									this.paqueteBonusCategoria = {
										categorias: [],
										dias: null,
										horas: null,
										meta: null,
										ganancia: null,
										bonificacion: null,
										exclusivo: false,
									};
								}
								this.$toast.add({
									severity: resp.data.creado ? "success" : "error",
									summary: "Nuevo Bonus",
									detail: resp.data.message,
									life: 1640,
								});
							})
							.catch((error) => {
								switch (error.response.data.statusCode) {
									case 401:
										//Se le termino la sesión
										this.store.clearUser();
										this.$router.push("/login");
										break;
									default:
										this.$toast.add({ severity: "error", summary: "Nuevo Bonus", detail: "No se pudo crear el bonus", life: 1600 });
										console.log("Error: ", error);
										break;
								}
							});
					} else {
						await axios
							.put(`${this.API}/bonus-categoria/actualizar/${this.idEditarBonusCategoria}`, this.paqueteBonusCategoria, this.token)
							.then((resp) => {
								if (resp.data.actualizado) {
									this.getBonosAgrupadosCategoria();
									this.getBonusMezclados();
									this.$refs.formBonusCategoria.reset();
									this.paqueteBonusCategoria = {
										categorias: [],
										dias: null,
										horas: null,
										meta: null,
										ganancia: null,
										bonificacion: null,
										exclusivo: false,
									};
									this.idEditarBonusCategoria = null;
									this.modalBonusCategoria = false;
								}
								this.$toast.add({
									severity: resp.data.actualizado ? "success" : "error",
									summary: "Actualizar Bonus",
									detail: resp.data.message,
									life: 1640,
								});
							})
							.catch((error) => {
								switch (error.response.data.statusCode) {
									case 401:
										//Se le termino la sesión
										this.store.clearUser();
										this.$router.push("/login");
										break;
									default:
										this.$toast.add({
											severity: "error",
											summary: "Actualizar bonus",
											detail: "No se pudo actualizar el bonus",
											life: 1600,
										});
										console.log("Error: ", error);
										break;
								}
							});
					}
					this.btnBonus = false;
				}
			} else {
				this.$toast.add({ severity: "error", summary: "Nuevo Bonus", detail: "Debes seleccionar al menos una categoria", life: 1600 });
			}
		},
		async getBonosAgrupadosCategoria() {
			await axios
				.get(`${this.API}/bonus-categoria/agrupados`, this.token)
				.then((resp) => {
					this.bonusCategoria = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Bonus Categoría", detail: "No se pudieron obtener los bonus", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async mezclarCategorias() {
			if (this.paqueteMezclar.categorias.length > 1) {
				this.btnBonus = true;
				await axios
					.post(`${this.API}/bonus-categoria/mezclar`, this.paqueteMezclar, this.token)
					.then((resp) => {
						if (resp.data.creado) {
							this.getBonusMezclados();
							this.categoriasMezcladas = this.paqueteMezclar.categorias;
							this.activePanel = 5 - this.categoriasMezcladas.length;
						}
						this.$toast.add({
							severity: resp.data.creado ? "success" : "error",
							summary: "Mezclar categorías",
							detail: resp.data.message,
							life: 1640,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({ severity: "error", summary: "Mezclar categoría", detail: "Ocurrió un problema", life: 1600 });
								console.log("Error: ", error);
								break;
						}
					});
				this.btnBonus = false;
			} else {
				this.$toast.add({
					severity: "error",
					summary: "Mezclar categorías",
					detail: "Debes seleccionar al menos 2 categorías",
					life: 1600,
				});
			}
		},
		async getMezclaCategorias() {
			await axios
				.get(`${this.API}/bonus-categoria/mezcla-categorias`, this.token)
				.then((resp) => {
					this.paqueteMezclar.categorias = resp.data.categorias;
					this.categoriasMezcladas = resp.data.categorias;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Obtener mezcla", detail: "Ocurrió un problema", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async reiniciarMezclaCategorias() {
			await axios
				.put(`${this.API}/bonus-categoria/mezcla/reiniciar`, {}, this.token)
				.then((resp) => {
					if (resp.data.reiniciado) {
						this.paqueteMezclar.categorias = [];
						this.bonusMezclados = [];
						this.categoriasMezcladas = [];
						this.activePanel = 5;
					}
					this.$toast.add({
						severity: resp.data.reiniciado ? "success" : "error",
						summary: "Reiniciar mezcla",
						detail: resp.data.message,
						life: 1640,
					});
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Reiniciar mezcla", detail: "Ocurrió un problema", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getBonusMezclados() {
			await axios
				.get(`${this.API}/bonus-categoria/mezcla-categorias/bonus`, this.token)
				.then((resp) => {
					this.bonusMezclados = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Obtener bonus", detail: "Ocurrió un problema", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getBonusCategorias() {
			await axios
				.get(`${this.API}/bonus-categoria`, this.token)
				.then((resp) => {
					this.allBonusCategoria = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Obtener bonus", detail: "Ocurrió un problema", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async getConfigBonus() {
			await axios.get(`${this.API}/bonus/config-bonus`).then((resp) => {
				this.configBonus.bonus_categoria = resp.data.bonus_categoria;
				this.configBonus.bonus_generales = resp.data.bonus_generales;
				this.configBonus.msgCat = resp.data.bonus_categoria == true ? "Desactivar" : "Activar";
				this.configBonus.msgGen = resp.data.bonus_generales == true ? "Desactivar" : "Activar";
			});
		},
		async getTotalPagar() {
			await axios.get(`${this.API}/usuario/bonus/total`).then((resp) => {
				this.totalPagar = resp.data;
			});
		},
		async cambiarConfigGenerales() {
			//Si es true, mandamos a desactivar
			if (this.configBonus.bonus_generales) {
				await axios
					.put(`${this.API}/bonus/desactivar-bonus-generales`, {}, this.token)
					.then((resp) => {
						if (resp.data.cambio) {
							this.getTotalPagar();
							this.getConfigBonus();
						}
						this.$toast.add({
							severity: resp.data.cambio ? "success" : "error",
							summary: "Cambiar estado",
							detail: resp.data.message,
							life: 1600,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({ severity: "error", summary: "Cambiar estado", detail: "Ocurrió un problema", life: 1600 });
								console.log("Error: ", error);
								break;
						}
					});
			} else {
				await axios
					.put(`${this.API}/bonus/activar-bonus-generales`, {}, this.token)
					.then((resp) => {
						if (resp.data.cambio) {
							this.getTotalPagar();
							this.getConfigBonus();
						}
						this.$toast.add({
							severity: resp.data.cambio ? "success" : "error",
							summary: "Cambiar estado",
							detail: resp.data.message,
							life: 1600,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({ severity: "error", summary: "Cambiar estado", detail: "Ocurrió un problema", life: 1600 });
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		async cambiarConfigCategoria() {
			//Si es true, mandamos a desactivar
			if (this.configBonus.bonus_categoria) {
				await axios
					.put(`${this.API}/bonus/desactivar-bonus-categorias`, {}, this.token)
					.then((resp) => {
						if (resp.data.cambio) {
							this.getTotalPagar();
							this.getConfigBonus();
						}
						this.$toast.add({
							severity: resp.data.cambio ? "success" : "error",
							summary: "Cambiar estado",
							detail: resp.data.message,
							life: 1600,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({ severity: "error", summary: "Cambiar estado", detail: "Ocurrió un problema", life: 1600 });
								console.log("Error: ", error);
								break;
						}
					});
			} else {
				await axios
					.put(`${this.API}/bonus/activar-bonus-categorias`, {}, this.token)
					.then((resp) => {
						if (resp.data.cambio) {
							this.getTotalPagar();
							this.getConfigBonus();
						}
						this.$toast.add({
							severity: resp.data.cambio ? "success" : "error",
							summary: "Cambiar estado",
							detail: resp.data.message,
							life: 1600,
						});
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.$toast.add({ severity: "error", summary: "Cambiar estado", detail: "Ocurrió un problema", life: 1600 });
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		comfirmDelete(id, nivel = null) {
			//Si nivel es null es porque es un bono por categorias
			if (nivel != null) {
				this.deleteBonusID = id;
				this.headerBonusDelete = `¿Desea eliminar el nivel ${nivel}?`;
			} else {
				this.idEliminarBonusCat = id;
				this.headerBonusDelete = "¿Desea eliminar el bonus?";
			}
			this.deleteBonusDialog = true;
		},
		async deleteBonusBd() {
			this.deleteBonusDialog = false;
			if (this.deleteBonusID != null) {
				await axios
					.delete(`${this.API}/bonus/${this.deleteBonusID}`, this.token)
					.then(async (resp) => {
						await this.obtenerBonus();
						this.$toast.add({ severity: "success", summary: "Información", detail: "Eliminado correctamente", life: 3000 });
						this.deleteBonusID = null;
						this.headerBonusDelete = "";
					})
					.catch((error) => {
						switch (error.response.data.statusCode) {
							case 401:
								//Se le termino la sesión
								this.store.clearUser();
								this.$router.push("/login");
								break;
							default:
								this.toast.add({ severity: "error", summary: "Autorización", detail: "ocurrio un error!", life: 3000 });
								console.log("Error: ", error);
								break;
						}
					});
			} else {
				await axios
					.delete(`${this.API}/bonus-categoria/${this.idEliminarBonusCat}`, this.token)
					.then((resp) => {
						this.$toast.add({
							severity: resp.data.eliminado ? "success" : "error",
							summary: "Eliminar bonus",
							detail: resp.data.message,
							life: 1600,
						});
						if (resp.data.eliminado) {
							this.idEliminarBonusCat = null;
							this.headerBonusDelete = "";
							this.getBonusCategorias();
							this.getBonosAgrupadosCategoria();
							this.getBonusMezclados();
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
								this.toast.add({ severity: "error", summary: "Eliminar bonus", detail: "Ocurrió un problema", life: 1600 });
								console.log("Error: ", error);
								break;
						}
					});
			}
		},
		async getMultiplicador() {
			axios.get(`${this.API}/bonus/multiplicador`).then((resp) => {
				this.multiplicador = resp.data.multiplicador;
			});
		},
		async getMisPremiosActuales() {
			await axios
				.get(`${this.API}/usuario/premios/actual/${this.usuario._id}`, this.token)
				.then((resp) => {
					this.idsMisPremios = resp.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.toast.add({ severity: "error", summary: "Autorización", detail: "ocurrio un error!", life: 3000 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		async reclamarBono(bono = null) {
			if (bono != null) {
				if (!this.reclamandoBonus) {
					this.reclamandoBonus = true;
					this.$toast.add({
						severity: "info",
						summary: "Reclamar bono",
						detail: "Reclamando bono, espera un momento...",
						life: 1600,
					});
					await axios
						.put(`${this.API}/bonus/reclamar/${bono}/${this.usuario._id}`, {}, this.token)
						.then(async (resp) => {
							if (!resp.data.error) {
								await this.getMisPremiosActuales();
								await this.getUsuario();
								await this.getConfigBonus();
								await this.obtenerBonus();
								await this.getBonosAgrupadosCategoria();
								setTimeout(() => {
									this.resaltarBonusExclusivo();
								}, 1200);
							}
							this.$toast.add({
								severity: resp.data.error ? "error" : "success",
								summary: "Reclamar bono",
								detail: resp.data.error ? resp.data.message : "Bono reclamado con éxito, ve a Mis premios para terminar la transacción",
								life: 1650,
							});
						})
						.catch((error) => {
							switch (error.response.data.statusCode) {
								case 401:
									//Se le termino la sesión
									this.store.clearUser();
									this.$router.push("/login");
									break;
								default:
									this.$toast.add({ severity: "error", summary: "Reclamar bono", detail: "Ocurrió un problema", life: 1600 });
									console.log("Error: ", error);
									break;
							}
						});
					this.reclamandoBonus = false;
				} else {
					this.$toast.add({
						severity: "info",
						summary: "Reclamar bono",
						detail: "Se está reclamando un bono, espera un momento...",
						life: 1600,
					});
				}
			}
		},
		async getUsuario() {
			await axios
				.get(`${this.API}/usuario/${this.store.getId()}`, this.token)
				.then((response) => {
					this.usuario_actual = response.data;
				})
				.catch((error) => {
					switch (error.response.data.statusCode) {
						case 401:
							//Se le termino la sesión
							this.store.clearUser();
							this.$router.push("/login");
							break;
						default:
							this.$toast.add({ severity: "error", summary: "Datos del usuario", detail: "Ocurrió un problema inesperado!", life: 1600 });
							console.log("Error: ", error);
							break;
					}
				});
		},
		yaReclamaron(id, isExclusivo = false, categorias) {
			//Se debe hacer toda la validación con usuario_actual y idsMisPremios para estar actualizados
			//Falta arreglar los bonos por categoría no exclusivos
			if (isExclusivo) {
				if (categorias == undefined) {
					/*
					Es un bono Exclusivo general
					Si no fue entregado anteriormente, lo busco en los actuales
					Si ya fue entregado en los premios del mes actual se pone Reclamado
					Sino fue porque se pudo haber reclamado en anteriores meses, se puede reclamar
					*/
					let indexPremio = this.idsMisPremios.findIndex((premio) => premio.id_concurso == id);
					if (indexPremio > -1) {
						return this.idsMisPremios[indexPremio].estado == "Entregado" ? [true, "Entregado"] : [true, "Reclamado"];
					}

					//Busco si el mes ya se entrego un premio de Nivel Exclusivo
					indexPremio = this.idsMisPremios.findIndex((premio) => premio.descripcion == "Nivel Exclusivo");
					return indexPremio > -1 ? [true, "No aplica"] : [false, "No aplica"];
				} else {
					//Es un bono Exclusivo por categoría
					//Si no fue entregado anteriormente, lo busco en los actuales
					let indexPremio = this.idsMisPremios.findIndex((premio) => premio.id_concurso == id);
					if (indexPremio > -1) {
						return this.idsMisPremios[indexPremio].estado == "Entregado" ? [true, "Entregado"] : [true, "Reclamado"];
					}

					//Busco si el id enviado ya fue entregado para la misma categoria, para dar un mensaje apropiado
					indexPremio = this.usuario_actual.premios.findIndex(
						(premio) => premio.id_concurso == id && premio.descripcion == `Categoría ${this.usuario_actual.creator_type} - Exclusivo`
					);
					if (indexPremio > -1) {
						return [true, "Entregado"];
					}

					//Si ya fue entregado un premio de la misma categoría
					indexPremio = this.usuario_actual.premios.findIndex(
						(premio) => premio.descripcion == `Categoría ${this.usuario_actual.creator_type} - Exclusivo`
					);
					return indexPremio > -1 ? [true, "No aplica"] : [false, "No aplica"];
				}
			} else {
				if (categorias == undefined) {
					//Es un bono general por nivel
					//Si no fue entregado anteriormente, lo busco en los premios actuales
					let indexPremio = this.idsMisPremios.findIndex((premio) => premio.id_concurso == id);
					if (indexPremio > -1) {
						return this.idsMisPremios[indexPremio].estado == "Entregado" ? [true, "Entregado"] : [true, "Reclamado"];
					}

					//Busco si ya fue entregado uno del mismo tipo
					//Solo Nivel 1, Nivel 2, etc.
					indexPremio = this.idsMisPremios.findIndex(
						(premio) => premio.descripcion != "Nivel Exclusivo" && !premio.descripcion.startsWith("Categoría")
					);

					return indexPremio > -1 ? [true, "No aplica"] : [false, "No aplica"];
				} else {
					//Es un bono por categoría
					//Busco si el id enviado ya fue entregado para mi categoria en el mes actual, para dar un mensaje apropiado
					let indexPremio = this.idsMisPremios.findIndex((premio) => premio.id_concurso == id);
					if (indexPremio > -1) {
						return this.idsMisPremios[indexPremio].estado == "Entregado" ? [true, "Entregado"] : [true, "Reclamado"];
					}
					//Si no fue entregado en el mes actual, lo busco en todos mis premios filtrando por la categoría
					indexPremio = this.usuario_actual.premios.findIndex(
						(premio) => premio.id_concurso == id && premio.descripcion == `Categoría ${this.usuario_actual.creator_type}`
					);
					if (indexPremio > -1) {
						return [true, "Entregado"];
					}
					//Si ya se entrego uno de mi categoría
					indexPremio = this.usuario_actual.premios.findIndex(
						(premio) => premio.descripcion == `Categoría ${this.usuario_actual.creator_type}`
					);
					return indexPremio > -1 ? [true, "No aplica"] : [false, "No aplica"];
				}
			}
		},
		formatHoras(tiempo) {
			const regex = /(\d+)h(\d+)m(\d+)s/;

			const format = tiempo.replace(regex, (match, horas, minutos, segundos) => {
				horas = horas === "0" ? "" : horas + "h";
				minutos = minutos === "0" ? "" : minutos + "min";
				segundos = segundos === "0" ? "" : segundos + "s";

				return `${horas} ${minutos} ${segundos}`;
			});

			return format;
		},
		resaltarBonusExclusivo() {
			const tablas = document.querySelectorAll("table");
			tablas.forEach((tabla) => {
				const body = tabla.querySelector("tbody");
				const filas = body.querySelectorAll("tr");
				let eventoAsignado = false;
				filas.forEach((fila) => {
					const primerTd = fila.querySelector("td");
					if (["Sí", "Exclusivo"].includes(primerTd.innerText)) {
						const divAntes = document.createElement("div");
						divAntes.classList.add("resaltar-exclusivo");
						const divDespues = document.createElement("div");
						divDespues.classList.add("resaltar-exclusivo");
						body.insertBefore(divAntes, fila);
						body.insertBefore(divDespues, fila.nextSibling);
						fila.classList.add("resaltado");
						if (!eventoAsignado) {
							tabla.parentElement.addEventListener("scroll", this.scrolling);
							eventoAsignado = true;
						}
					}
				});
			});
		},
		scrolling(event) {
			let scrollTop = event.target.scrollTop;
			let tabla = event.target.querySelector("table");
			let heightExclusivos = this.getHeightExclusivos(tabla) - 10;
			console.log(scrollTop, heightExclusivos);

			const body = tabla.querySelector("tbody");
			const filas = body.querySelectorAll("tr");
			filas.forEach((fila) => {
				const primerTd = fila.querySelector("td");
				if (["Sí", "Exclusivo"].includes(primerTd.innerText)) {
					let anterior = fila.previousElementSibling;
					let siguiente = fila.nextElementSibling;
					if (scrollTop > heightExclusivos) {
						anterior.classList.add("hidden");
						siguiente.classList.add("hidden");
					} else {
						if (anterior.classList.contains("hidden") && siguiente.classList.contains("hidden")) {
							anterior.classList.remove("hidden");
							siguiente.classList.remove("hidden");
						}
					}
				}
			});
		},
		getHeightExclusivos(tabla) {
			let heightExclusivos = 0;
			let body = tabla.querySelector("tbody");
			let filas = body.querySelectorAll("tr");
			filas.forEach((fila) => {
				let primerTd = fila.querySelector("td");
				if (["Sí", "Exclusivo"].includes(primerTd.innerText)) {
					heightExclusivos += parseFloat(fila.offsetHeight);
				}
			});
			return heightExclusivos;
		},
	},
	async created() {
		this.store = useStoreEvento();
		this.token = {
			headers: {
				Authorization: `Bearer ${this.store.getToken()}`,
			},
		};
		if (!this.store.isActive()) {
			this.$router.push("/login");
		}
		this.admin = this.store.isAdmin();
		if (!this.admin) {
			this.usuario = this.store.getUsuario();
			await this.getMisPremiosActuales();
			await this.getUsuario();
			this.estadisticas.dias = parseInt(this.usuario.dias_validos_mes_actual);
			this.estadisticas.horas = this.usuario.last_live_duration_mes_actual.includes("h")
				? parseInt(this.usuario.last_live_duration_mes_actual.split("h")[0])
				: 0;
			this.estadisticas.diamantes = parseInt(this.usuario.diamantes_mes_actual);
			//axios.get(`${this.API}/bonus/definirBonus`);
		} else {
			await this.getTotalPagar();
			await this.getBonusCategorias();
			await this.getMezclaCategorias();
			await this.getBonusMezclados();
		}
		await this.getConfigBonus();
		await this.getBonosAgrupadosCategoria();
		await this.obtenerBonus();
		await this.getMultiplicador();
		setTimeout(() => {
			this.resaltarBonusExclusivo();
		}, 1200);
	},
};
</script>
<style>
.resaltar-exclusivo {
	height: 4px;
	width: 100%;
	position: absolute;
	background-image: url("/assets/img/eventos/fluido-verde.png");
	background-size: 100% 4px !important;
	background-color: transparent;
	z-index: 1;
}
.bonus-usuario > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > .resaltar-exclusivo {
	height: 4px;
	width: calc(100% - 14px);
	position: absolute;
	background-image: url("/assets/img/eventos/fluido-verde.png");
	background-size: 100% 4px !important;
	background-color: transparent;
	z-index: 1;
}

.p-avatar.p-avatar-image.categoria {
	width: 52px !important;
	height: 75px !important;
}

.p-avatar.p-avatar-image.categoria > img {
	background-size: cover !important;
}

.tabBonus > .p-tabview-nav-container > .p-tabview-nav-content > .p-tabview-nav {
	align-items: center !important;
}

.tabBonus > .p-tabview-nav-container > .p-tabview-nav-content > .p-tabview-nav > li.p-tabview-header.tab-primero > a,
.tabBonusUsuario > .p-tabview-nav-container > .p-tabview-nav-content > .p-tabview-nav > li.p-tabview-header.tab-primero > a,
.tabBonus > .p-tabview-nav-container > .p-tabview-nav-content > .p-tabview-nav > li.p-tabview-header.tab-ultimo > a {
	padding-top: 2.5rem !important;
	padding-bottom: 2.5rem !important;
}

.nocompleto {
	background-color: #ff3d32;
}

.usuario {
	background-image: url("/assets/img/perfil/fondo.png") !important;
	background-repeat: no-repeat;
	background-size: cover;
}

.bonus-usuario > .p-datatable-wrapper > .p-datatable-table > .p-datatable-thead > tr > th {
	color: #69c9d0;
}

.bonus-usuario > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > tr > td {
	color: white;
}

.usuario > .Bonus > .p-panel-header,
.usuario > .Bonus > .p-toggleable-content > .p-panel-content,
.bonus-usuario > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > tr > td,
.bonus-usuario > .p-datatable-wrapper > .p-datatable-table > .p-datatable-thead > tr > th {
	background-color: transparent;
	border: none;
}

.bonus-usuario > .p-datatable-wrapper > .p-datatable-table > .p-datatable-tbody > tr:not(.resaltado) {
	background-image: url("/assets/img/eventos/divisor-fila.png") !important;
	background-repeat: repeat-x !important;
	background-size: contain !important;
	background-color: transparent;
}

.resaltado {
	background-color: transparent;
}

.usuario > .Bonus > .p-toggleable-content > .p-panel-content > .bonus-usuario {
	max-width: 1100px !important;
	margin: auto !important;
}

.usuario
	> .Bonus
	> .p-toggleable-content
	> .p-panel-content
	> .p-tabview
	> .p-tabview-panels
	> .p-tabview-panel
	> .bonus-usuario
	> .p-datatable-wrapper {
	height: 650px;
}

.usuario
	> .Bonus
	> .p-toggleable-content
	> .p-panel-content
	> .p-tabview
	> .p-tabview-panels
	> .p-tabview-panel
	> .bonus-usuario
	> .p-datatable-wrapper::-webkit-scrollbar {
	width: 8px;
}

.usuario
	> .Bonus
	> .p-toggleable-content
	> .p-panel-content
	> .p-tabview
	> .p-tabview-panels
	> .p-tabview-panel
	> .bonus-usuario
	> .p-datatable-wrapper::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.usuario
	> .Bonus
	> .p-toggleable-content
	> .p-panel-content
	> .p-tabview
	> .p-tabview-panels
	> .p-tabview-panel
	> .bonus-usuario
	> .p-datatable-wrapper::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 10px;
}

.usuario
	> .Bonus
	> .p-toggleable-content
	> .p-panel-content
	> .p-tabview
	> .p-tabview-panels
	> .p-tabview-panel
	> .bonus-usuario
	> .p-datatable-wrapper::-webkit-scrollbar-thumb:hover {
	background: #555;
}

.usuario > .Bonus > .p-toggleable-content > .p-panel-content {
	background-image: url("/assets/img/eventos/marco-tabla.png") !important;
	background-repeat: no-repeat;
	background-size: 100% 99%;
	padding: 46px;
}

.barra-progreso-horas {
	background-image: url("/assets/img/perfil/barra-horas.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	height: 30px;
	padding: 2px;
}

.barra-progreso-horas > * {
	background-repeat: no-repeat;
	background-size: 100% 100%;
	height: 26px;
	position: relative;
	top: -23px;
}

.barra-progreso-horas > .diamante {
	background-image: url("/assets/img/perfil/iconos/terminado.png");
	width: 100px;
	height: 100px;
	top: -37px;
	z-index: 2;
	left: -44px;
}

.barra-progreso-horas > .rojo {
	background-image: url("/assets/img/perfil/iconos/rojo.png");
	border-top-left-radius: 12px;
	border-bottom-left-radius: 12px;
}

.barra-progreso-horas > .verde {
	background-image: url("/assets/img/perfil/iconos/verde.png");
	border-top-left-radius: 12px;
	border-bottom-left-radius: 12px;
	border-top-right-radius: 12px;
	border-bottom-right-radius: 12px;
	top: -100px;
	z-index: 1;
	position: relative !important;
}

.barra-progreso-horas > .verde + p {
	top: -123px;
	z-index: 1;
	position: relative !important;
}

.barra-progreso-horas > .casi {
	background-image: url("/assets/img/perfil/iconos/casi.png");
	border-top-left-radius: 12px;
	border-bottom-left-radius: 12px;
}

.aplica {
	background-image: url("/assets/img/perfil/iconos/aplica.png");
	background-repeat: no-repeat;
	background-size: 100% 100%;
	text-align: center;
	padding: 12px 22px;
}
</style>