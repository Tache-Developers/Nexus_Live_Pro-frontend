const menu = [{
        rol: 'Usuario',
        opciones: [{
            label: 'Bonus',
            icon: 'pi pi-money-bill',
            route: '/panel/bonus',
        }]
    },
    {
        rol: 'Admin',
        opciones: [{
                label: 'Eventos',
                icon: 'pi pi-calendar-plus',
                route: '/panel/evento',
            },
            {
                label: 'Creadores',
                icon: 'pi pi-users',
                route: '/panel/creadores',
            }
        ]
    }
];
export default menu;