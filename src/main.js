import { createApp } from "vue";
import "./style.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/lara-dark-green/theme.css";
import "vue3-carousel/dist/carousel.css";

import App from "./App.vue";
import PrimeVue from "primevue/config";
import router from "./router";
import { createPinia } from "pinia";

// Componentes Principales
import AppBar from "./components/AppBar.vue";
import NavBar from "./components/NavBar.vue";
import Clasificacion from "./components/Clasificacion.vue";
import Footer from "./components/Footer.vue";
import Phone from "./components/Phone.vue";
import Insignias from "./components/Insignias.vue";
import CajaSorpresa from "./components/CajaSorpresa.vue";
import TopCreador from "./components/TopCreador.vue";

import AutoComplete from "primevue/autocomplete";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import AnimateOnScroll from "primevue/animateonscroll";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Badge from "primevue/badge";
import BadgeDirective from "primevue/badgedirective";
import BlockUI from "primevue/blockui";
import Button from "primevue/button";
import Breadcrumb from "primevue/breadcrumb";
import Calendar from "primevue/calendar";
import Card from "primevue/card";
import CascadeSelect from "primevue/cascadeselect";
import CarouselPrime from "primevue/carousel";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import Chips from "primevue/chips";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmationService from "primevue/confirmationservice";
import ContextMenu from "primevue/contextmenu";
import DataTable from "primevue/datatable";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import DeferredContent from "primevue/deferredcontent";
import Dialog from "primevue/dialog";
import DialogService from "primevue/dialogservice";
import Divider from "primevue/divider";
import Dock from "primevue/dock";
import Dropdown from "primevue/dropdown";
import DynamicDialog from "primevue/dynamicdialog";
import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";
import FocusTrap from "primevue/focustrap";
import Galleria from "primevue/galleria";
import Image from "primevue/image";
import InlineMessage from "primevue/inlinemessage";
import Inplace from "primevue/inplace";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import Knob from "primevue/knob";
import Listbox from "primevue/listbox";
import MegaMenu from "primevue/megamenu";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import OrderList from "primevue/orderlist";
import OrganizationChart from "primevue/organizationchart";
import OverlayPanel from "primevue/overlaypanel";
import Paginator from "primevue/paginator";
import Panel from "primevue/panel";
import PanelMenu from "primevue/panelmenu";
import Password from "primevue/password";
import PickList from "primevue/picklist";
import ProgressBar from "primevue/progressbar";
import ProgressSpinner from "primevue/progressspinner";
import Rating from "primevue/rating";
import RadioButton from "primevue/radiobutton";
import Ripple from "primevue/ripple";
import Row from "primevue/row";
import SelectButton from "primevue/selectbutton";
import ScrollPanel from "primevue/scrollpanel";
import ScrollTop from "primevue/scrolltop";
import Skeleton from "primevue/skeleton";
import Slider from "primevue/slider";
import Sidebar from "primevue/sidebar";
import SpeedDial from "primevue/speeddial";
import SplitButton from "primevue/splitbutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Steps from "primevue/steps";
import StyleClass from "primevue/styleclass";
import TabMenu from "primevue/tabmenu";
import TieredMenu from "primevue/tieredmenu";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Toolbar from "primevue/toolbar";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Tag from "primevue/tag";
import Terminal from "primevue/terminal";
import Timeline from "primevue/timeline";
import ToggleButton from "primevue/togglebutton";
import Tooltip from "primevue/tooltip";
import Tree from "primevue/tree";
import TreeSelect from "primevue/treeselect";
import TreeTable from "primevue/treetable";
import TriStateCheckbox from "primevue/tristatecheckbox";
import VirtualScroller from "primevue/virtualscroller";
import ListaRegalos from "./components/ListaRegalos.vue";
import DialogSeleccionarCreador from "./components/DialogSeleccionarCreador.vue";
import VCalendar from "v-calendar";
import "v-calendar/style.css";

//Carousel vue3-carousel
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
const app = createApp(App);

app.component("VueCarousel", Carousel);
app.component("VueSlide", Slide);
app.component("VuePagination", Pagination);
app.component("VueNavigation", Navigation);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
	locale: {
		dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
		dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
		dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
		monthNames: [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		],
		monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ag", "Sep", "Oct", "Nov", "Dic"],
		chooseYear: "Elegir año",
		chooseMonth: "Elegir mes",
		chooseDate: "Elegir día",
		prevYear: "Año anterior",
		nextYear: "Año siguiente",
		prevMonth: "Mes anterior",
		nextMonth: "Mes siguiente",
		today: "Hoy",
		weekHeader: "Semana",
		firstDayOfWeek: 1,
		dateFormat: "yy-mm-dd",
		weak: "Semana",
	},
});

app.use(VCalendar, {
	color: "green",
});

app.component("TopCreador", TopCreador);
app.component("AppBar", AppBar);
app.component("NavBar", NavBar);
app.component("Clasificacion", Clasificacion);
app.component("Footer", Footer);
app.component("Phone", Phone);
app.component("Insignias", Insignias);
app.component("CajaSorpresa", CajaSorpresa);
app.component("ListaRegalos", ListaRegalos);
app.component("DialogSeleccionarCreador", DialogSeleccionarCreador);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

app.directive("tooltip", Tooltip);
app.directive("badge", BadgeDirective);
app.directive("ripple", Ripple);
app.directive("styleclass", StyleClass);
app.directive("focustrap", FocusTrap);
app.directive("animateonscroll", AnimateOnScroll);

app.component("Accordion", Accordion);
app.component("AccordionTab", AccordionTab);
app.component("AutoComplete", AutoComplete);
app.component("Avatar", Avatar);
app.component("AvatarGroup", AvatarGroup);
app.component("Badge", Badge);
app.component("BlockUI", BlockUI);
app.component("Breadcrumb", Breadcrumb);
app.component("Button", Button);
app.component("Calendar", Calendar);
app.component("Card", Card);
app.component("Carousel", CarouselPrime);
app.component("CascadeSelect", CascadeSelect);
app.component("Checkbox", Checkbox);
app.component("Chip", Chip);
app.component("Chips", Chips);
app.component("ColorPicker", ColorPicker);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("ConfirmDialog", ConfirmDialog);
app.component("ConfirmPopup", ConfirmPopup);
app.component("ContextMenu", ContextMenu);
app.component("DataTable", DataTable);
app.component("DataView", DataView);
app.component("DataViewLayoutOptions", DataViewLayoutOptions);
app.component("DeferredContent", DeferredContent);
app.component("Dialog", Dialog);
app.component("Divider", Divider);
app.component("Dock", Dock);
app.component("Dropdown", Dropdown);
app.component("DynamicDialog", DynamicDialog);
app.component("Fieldset", Fieldset);
app.component("FileUpload", FileUpload);
app.component("Galleria", Galleria);
app.component("Image", Image);
app.component("InlineMessage", InlineMessage);
app.component("Inplace", Inplace);
app.component("InputGroup", InputGroup);
app.component("InputGroupAddon", InputGroupAddon);
app.component("InputMask", InputMask);
app.component("InputNumber", InputNumber);
app.component("InputSwitch", InputSwitch);
app.component("InputText", InputText);
app.component("Knob", Knob);
app.component("Listbox", Listbox);
app.component("MegaMenu", MegaMenu);
app.component("Menu", Menu);
app.component("Menubar", Menubar);
app.component("Message", Message);
app.component("MultiSelect", MultiSelect);
app.component("OrderList", OrderList);
app.component("OrganizationChart", OrganizationChart);
app.component("OverlayPanel", OverlayPanel);
app.component("Paginator", Paginator);
app.component("Panel", Panel);
app.component("PanelMenu", PanelMenu);
app.component("Password", Password);
app.component("PickList", PickList);
app.component("ProgressBar", ProgressBar);
app.component("ProgressSpinner", ProgressSpinner);
app.component("RadioButton", RadioButton);
app.component("Rating", Rating);
app.component("Row", Row);
app.component("SelectButton", SelectButton);
app.component("ScrollPanel", ScrollPanel);
app.component("ScrollTop", ScrollTop);
app.component("Slider", Slider);
app.component("Sidebar", Sidebar);
app.component("Skeleton", Skeleton);
app.component("SpeedDial", SpeedDial);
app.component("SplitButton", SplitButton);
app.component("Splitter", Splitter);
app.component("SplitterPanel", SplitterPanel);
app.component("Steps", Steps);
app.component("TabMenu", TabMenu);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("Tag", Tag);
app.component("Textarea", Textarea);
app.component("Terminal", Terminal);
app.component("TieredMenu", TieredMenu);
app.component("Timeline", Timeline);
app.component("Toast", Toast);
app.component("Toolbar", Toolbar);
app.component("ToggleButton", ToggleButton);
app.component("Tree", Tree);
app.component("TreeSelect", TreeSelect);
app.component("TreeTable", TreeTable);
app.component("TriStateCheckbox", TriStateCheckbox);
app.component("VirtualScroller", VirtualScroller);

app.mount("#app");
