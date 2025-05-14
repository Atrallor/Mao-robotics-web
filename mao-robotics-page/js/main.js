async function fetchDataW() {
    try {
        const response = await fetch('https://mao-robotics.onrender.com/obtenerTrabajadores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error de conexion');
        }

        const data = await response.json();
        const tableBody = document.getElementById('workerData');
        tableBody.innerHTML = ''; 
        
        data.forEach(mao => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mao._id}</td>
                <td>${mao.mao}</td>
                <td>${mao.fabrica_Origen}</td>
                <td>${mao.energia}</td>
                <td>
                    <span class="badge badge--${mao.ejecucion ? 'active' : 'desactive'}">${mao.ejecucion ? 'Activo' : 'Inactivo'}</span>
                </td>
                <td>
                    <button class="action action--edit-worker" data-id="${mao._id}" data-name="${mao.mao}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${mao._id}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching workers:', error);
        showNotification('Error al cargar trabajadores', 'error');
    }
}

async function fetchDataP() {
    try {
        const response = await fetch('https://mao-robotics.onrender.com/obtenerProfesiones', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error de conexion');
        }

        const data = await response.json();
        const tableBody = document.getElementById('professionData');
        tableBody.innerHTML = ''; 

        data.forEach(profession => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${profession._id}</td>
                <td>${profession.profesion}</td>
                <td>${profession.rol}</td>
                <td>${profession.salario.toLocaleString('es-ES', {style: 'currency', currency: 'COP'})}</td>
                <td>
                    <button class="action action--edit-profession" data-id="${profession._id}" data-name="${profession.profesion}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${profession._id}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching professions:', error);
        showNotification('Error al cargar profesiones', 'error');
    }
}

async function fetchDataL() {
    try {
        const response = await fetch('https://mao-robotics.onrender.com/obtenerLugares', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error de conexion');
        }

        const data = await response.json();
        const tableBody = document.getElementById('locationData');
        tableBody.innerHTML = ''; 

        data.forEach(location => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${location._id}</td>
                <td>${location.Nombre}</td>
                <td>${location.Ubicacion}</td>
                <td>${location.Capacidad_Personas}</td>
                <td><span class="badge badge--${location.Prioridad === 'Alta' ? 'high' : location.Prioridad === 'Media' ? 'middle' : 'low'}">${location.Prioridad}</span>
                </td>
                <td>
                    <button class="action action--edit-place" data-id="${location._id}" data-name="${location.Nombre}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${location._id}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching locations:', error);
        showNotification('Error al cargar lugares', 'error');
    }
}

async function fetchAllData() {
    try {
        await Promise.all([
            fetchDataW(), 
            fetchDataL(), 
            fetchDataP()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error al cargar datos iniciales', 'error');
    }
}

async function searchWorkers() {
    const searchForm = document.getElementById('searchWorkers');
    if (!searchForm) return;
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        const id = document.getElementById('search-worker-id').value;
        const mao = document.getElementById('search-worker-name').value;
        const url = `https://mao-robotics.onrender.com/buscarTrabajadores/${id}/${mao}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error de conexion');
            }
            const data = await response.json();
            const tableBody = document.getElementById('workerData');
            tableBody.innerHTML = ''; 
            
            data.forEach(mao => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${mao._id}</td>
                    <td>${mao.mao}</td>
                    <td>${mao.fabrica_Origen}</td>
                    <td>${mao.energia}</td>
                    <td>
                        <span class="badge badge--${mao.ejecucion ? 'active' : 'desactive'}">${mao.ejecucion ? 'Activo' : 'Inactivo'} </span>
                    </td>
                    <td>
                        <button onclick="editWorker('${mao._id}', '${mao.mao}')" class="action action--edit-worker">
                            <i class="fi fi-ss-edit"></i>
                        </button>
                        <button onclick="prepareDeleteWorker('${mao._id}')" class="action action--delete">
                            <i class="fi fi-ss-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error searching workers:', error);
            showNotification('Error al buscar trabajadores', 'error');
        }
    });
}

async function searchLocations() {
    const searchForm = document.getElementById('searchLocations');
    if (!searchForm) return;
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        const id = document.getElementById('search-place-id').value;
        const name = document.getElementById('search-place-name').value;
        const url = `https://mao-robotics.onrender.com/buscarLugares/${id}/${name}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error de conexion');
            }
            
            const data = await response.json();
            const tableBody = document.getElementById('locationData');
            tableBody.innerHTML = ''; 
    
            data.forEach(location => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${location._id}</td>
                    <td>${location.Nombre}</td>
                    <td>${location.Ubicacion}</td>
                    <td>${location.Capacidad_Personas}</td>
                    <td><span class="badge badge--${location.Prioridad === 'Alta' ? 'high' : location.Prioridad === 'Media' ? 'middle' : 'low'}"> ${location.Prioridad}</span>
                    </td>
                    <td>
                        <button onclick="editLocation('${location._id}', '${location.Nombre}')" class="action action--edit-place">
                            <i class="fi fi-ss-edit"></i>
                        </button>
                        <button onclick="prepareDeleteLocation('${location._id}')" class="action action--delete">
                            <i class="fi fi-ss-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error searching locations:', error);
            showNotification('Error al buscar lugares', 'error');
        }
    });
}

async function searchProfessions() {
    const searchForm = document.getElementById('searchProfessions');
    if (!searchForm) return;
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        const id = document.getElementById('search-prof-id').value;
        const profession = document.getElementById('search-prof-name').value;
        const url = `https://mao-robotics.onrender.com/buscarProfesiones/${id}/${profession}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error de conexion');
            }
            const data = await response.json();
            const tableBody = document.getElementById('professionData');
            tableBody.innerHTML = ''; 
    
            data.forEach(profession => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${profession._id}</td>
                    <td>${profession.profesion}</td>
                    <td>${profession.rol}</td>
                    <td>${profession.salario.toLocaleString('es-ES', {style: 'currency', currency: 'COP'})}</td>
                    <td>
                        <button onclick="editProfession('${profession._id}', '${profession.profesion}')" class="action action--edit-profession">
                            <i class="fi fi-ss-edit"></i>
                        </button>
                        <button onclick="prepareDeleteProfession('${profession._id}')" class="action action--delete">
                            <i class="fi fi-ss-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error searching professions:', error);
            showNotification('Error al buscar profesiones', 'error');
        }
    });
}

async function addWorker() {
    const addForm = document.getElementById('addWorker');
    if (!addForm) return;

    addForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = {
            mao: document.getElementById('worker-name').value,
            fabrica_Origen: document.getElementById('worker-factory').value,
            id_Profesion: document.getElementById('worker-profession').value,
            id_LugarAsignado: document.getElementById('worker-place').value,
            energia: document.getElementById('worker-energy').value,
            fecha_Inicio: document.getElementById('worker-date').value,
            ejecucion: document.getElementById('worker-status').value === 'true',
            limite_Garantia: document.getElementById('worker-warranty').value,
            meses_Mantenimiento: document.getElementById('worker-maintenance').value,
        };

        try {
            const response = await fetch('https://mao-robotics.onrender.com/agregarTrabajador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar trabajador');
            }

            const data = await response.json();
            addForm.reset();
            fetchDataW();
            showNotification('Trabajador agregado correctamente', 'success');
        } catch (error) {
            console.error('Error adding worker:', error);
            showNotification(error.message || 'Error al agregar trabajador', 'error');
        }
    });
}

async function addLocation() {
    const addForm = document.getElementById('addLocation');
    if (!addForm) return;

    addForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = {
            Nombre: document.getElementById('place-name').value,
            Ubicacion: document.getElementById('place-location').value,
            Horario: document.getElementById('place-schedule').value,
            Capacidad_Personas: parseInt(document.getElementById('place-capacity').value),
            Fecha_creacion: parseInt(document.getElementById('place-date').value),
            Dependencia: document.getElementById('place-dependency').value,
            Servicios: document.getElementById('place-services').value,
            Prioridad: document.getElementById('place-priority').value,
            Equimamiento: document.getElementById('place-equipment').value,
            Accesibilidad: document.getElementById('place-access').value,
        };

        try {
            const response = await fetch('https://mao-robotics.onrender.com/agregarLugar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar lugar');
            }

            const data = await response.json();
            addForm.reset();
            fetchDataL();
            showNotification('Lugar agregado correctamente', 'success');
        } catch (error) {
            console.error('Error adding location:', error);
            showNotification(error.message || 'Error al agregar lugar', 'error');
        }
    });
}

async function addProfession() {
    const addForm = document.getElementById('addProfession');
    if (!addForm) return;

    addForm.addEventListener('submit',  async function(event) {
        event.preventDefault();
        const formData = {
            profesion: document.getElementById('prof-name').value,
            rol: document.getElementById('prof-role').value,
            estudios: document.getElementById('prof-studies').value,
            "experiencia-requerida": document.getElementById('prof-experience').value,
            "habilidad-tecnica": document.getElementById('prof-skill').value,
            "habilidad-blanda": document.getElementById('prof-soft').value,
            herramienta: document.getElementById('prof-tool').value,
            salario: parseFloat(document.getElementById('prof-salary').value),
            horario: document.getElementById('prof-schedule').value,
        };

        try {
            const response = await fetch('https://mao-robotics.onrender.com/agregarProfesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar profesión');
            }

            const data = await response.json();
            addForm.reset();
            fetchDataP();
            showNotification('Profesión agregada correctamente', 'success');
        } catch (error) {
            console.error('Error adding profession:', error);
            showNotification(error.message || 'Error al agregar profesión', 'error');
        }
    });
}

async function editWorker(id, name) {
    try {
        const response = await fetch(`https://mao-robotics.onrender.com/buscarTrabajadores/${id}/${name}`);
        if (!response.ok) throw new Error('Error al obtener datos del trabajador');
        
        const worker = await response.json();
        if (!worker || worker.length === 0) throw new Error('Trabajador no encontrado');
        
        document.getElementById('edit-worker-name').value = worker[0].mao;
        document.getElementById('edit-worker-factory').value = worker[0].fabrica_Origen;
        document.getElementById('edit-worker-profession').value = worker[0].id_Profesion;
        document.getElementById('edit-worker-place').value = worker[0].id_LugarAsignado;
        document.getElementById('edit-worker-energy').value = worker[0].energia;
        document.getElementById('edit-worker-date').value = worker[0].fecha_Inicio.split('T')[0];
        document.getElementById('edit-worker-status').value = worker[0].ejecucion ? 'true' : 'false';
        document.getElementById('edit-worker-warranty').value = worker[0].limite_Garantia.split('T')[0];
        document.getElementById('edit-worker-maintenance').value = worker[0].meses_Mantenimiento;
        
        document.getElementById('editWorkerModal').style.display = 'flex';
        
        const editForm = document.querySelector('#editWorkerModal form');
        editForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const updatedData = {
                mao: document.getElementById('edit-worker-name').value,
                fabrica_Origen: document.getElementById('edit-worker-factory').value,
                id_Profesion: document.getElementById('edit-worker-profession').value,
                id_LugarAsignado: document.getElementById('edit-worker-place').value,
                energia: document.getElementById('edit-worker-energy').value,
                fecha_Inicio: document.getElementById('edit-worker-date').value,
                ejecucion: document.getElementById('edit-worker-status').value === 'true',
                limite_Garantia: document.getElementById('edit-worker-warranty').value,
                meses_Mantenimiento: document.getElementById('edit-worker-maintenance').value,
            };
            
            try {
                const updateResponse = await fetch(`https://mao-robotics.onrender.com/editarTrabajador/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
                
                if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    throw new Error(errorData.message || 'Error al actualizar trabajador');
                }
                
                document.getElementById('editWorkerModal').style.display = 'none';
                fetchDataW();
                showNotification('Trabajador actualizado correctamente', 'success');
            } catch (error) {
                console.error('Error updating worker:', error);
                showNotification(error.message || 'Error al actualizar trabajador', 'error');
            }
        };
    } catch (error) {
        console.error('Error loading worker data:', error);
        showNotification(error.message || 'Error al cargar datos del trabajador', 'error');
    }
}

async function editLocation(id, name) {
    try {
        const response = await fetch(`https://mao-robotics.onrender.com/buscarLugares/${id}/${name}`);
        if (!response.ok) throw new Error('Error al obtener datos del lugar');
        
        const location = await response.json();
        if (!location || location.length === 0) throw new Error('Lugar no encontrado');
        
        document.getElementById('edit-place-name').value = location[0].Nombre;
        document.getElementById('edit-place-location').value = location[0].Ubicacion;
        document.getElementById('edit-place-schedule').value = location[0].Horario;
        document.getElementById('edit-place-capacity').value = location[0].Capacidad_Personas;
        document.getElementById('edit-place-date').value = location[0].Fecha_creacion;
        document.getElementById('edit-place-dependency').value = location[0].Dependencia;
        document.getElementById('edit-place-services').value = location[0].Servicios;
        document.getElementById('edit-place-priority').value = location[0].Prioridad;
        document.getElementById('edit-place-equipment').value = location[0].Equimamiento;
        document.getElementById('edit-place-access').value = location[0].Accesibilidad;
        
        document.getElementById('editPlaceModal').style.display = 'flex';
        
        const editForm = document.querySelector('#editPlaceModal form');
        editForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const updatedData = {
                Nombre: document.getElementById('edit-place-name').value,
                Ubicacion: document.getElementById('edit-place-location').value,
                Horario: document.getElementById('edit-place-schedule').value,
                Capacidad_Personas: parseInt(document.getElementById('edit-place-capacity').value),
                Fecha_creacion: parseInt(document.getElementById('edit-place-date').value),
                Dependencia: document.getElementById('edit-place-dependency').value,
                Servicios: document.getElementById('edit-place-services').value,
                Prioridad: document.getElementById('edit-place-priority').value,
                Equimamiento: document.getElementById('edit-place-equipment').value,
                Accesibilidad: document.getElementById('edit-place-access').value,
            };
            
            try {
                const updateResponse = await fetch(`https://mao-robotics.onrender.com/editarLugar/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
                
                if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    throw new Error(errorData.message || 'Error al actualizar lugar');
                }
                
                document.getElementById('editPlaceModal').style.display = 'none';
                fetchDataL();
                showNotification('Lugar actualizado correctamente', 'success');
            } catch (error) {
                console.error('Error updating location:', error);
                showNotification(error.message || 'Error al actualizar lugar', 'error');
            }
        };
    } catch (error) {
        console.error('Error loading location data:', error);
        showNotification(error.message || 'Error al cargar datos del lugar', 'error');
    }
}

async function editProfession(id, name) {
    try {
        const response = await fetch(`https://mao-robotics.onrender.com/buscarProfesiones/${id}/${name}`);
        if (!response.ok) throw new Error('Error al obtener datos de la profesión');
        
        const profession = await response.json();
        if (!profession || profession.length === 0) throw new Error('Profesión no encontrada');
        
        document.getElementById('edit-prof-name').value = profession[0].profesion;
        document.getElementById('edit-prof-role').value = profession[0].rol;
        document.getElementById('edit-prof-studies').value = profession[0].estudios;
        document.getElementById('edit-prof-experience').value = profession[0]["experiencia-requerida"];
        document.getElementById('edit-prof-skill').value = profession[0]["habilidad-tecnica"];
        document.getElementById('edit-prof-soft').value = profession[0]["habilidad-blanda"];
        document.getElementById('edit-prof-tool').value = profession[0].herramienta;
        document.getElementById('edit-prof-salary').value = profession[0].salario;
        document.getElementById('edit-prof-schedule').value = profession[0].horario;
        
        document.getElementById('editProfessionModal').style.display = 'flex';
        
        const editForm = document.querySelector('#editProfessionModal form');
        editForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const updatedData = {
                profesion: document.getElementById('edit-prof-name').value,
                rol: document.getElementById('edit-prof-role').value,
                estudios: document.getElementById('edit-prof-studies').value,
                "experiencia-requerida": document.getElementById('edit-prof-experience').value,
                "habilidad-tecnica": document.getElementById('edit-prof-skill').value,
                "habilidad-blanda": document.getElementById('edit-prof-soft').value,
                herramienta: document.getElementById('edit-prof-tool').value,
                salario: parseFloat(document.getElementById('edit-prof-salary').value),
                horario: document.getElementById('edit-prof-schedule').value,
            };
            
            try {
                const updateResponse = await fetch(`https://mao-robotics.onrender.com/editarProfesion/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
                
                if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    throw new Error(errorData.message || 'Error al actualizar profesión');
                }
                
                document.getElementById('editProfessionModal').style.display = 'none';
                fetchDataP();
                showNotification('Profesión actualizada correctamente', 'success');
            } catch (error) {
                console.error('Error updating profession:', error);
                showNotification(error.message || 'Error al actualizar profesión', 'error');
            }
        };
    } catch (error) {
        console.error('Error loading profession data:', error);
        showNotification(error.message || 'Error al cargar datos de la profesión', 'error');
    }
}

let currentDeleteId = null;
let currentDeleteType = null; 

function prepareDeleteWorker(id) {
    currentDeleteId = id;
    currentDeleteType = 'worker';
    document.getElementById('deleteModal').style.display = 'flex';
}

function prepareDeleteLocation(id) {
    currentDeleteId = id;
    currentDeleteType = 'location';
    document.getElementById('deleteModal').style.display = 'flex';
}

function prepareDeleteProfession(id) {
    currentDeleteId = id;
    currentDeleteType = 'profession';
    document.getElementById('deleteModal').style.display = 'flex';
}

async function confirmDelete() {
    if (!currentDeleteId || !currentDeleteType) return;
    
    let endpoint = '';
    let successMessage = '';
    let fetchFunction = null;
    
    switch(currentDeleteType) {
        case 'worker':
            endpoint = `https://mao-robotics.onrender.com/eliminarTrabajador/${currentDeleteId}`;
            successMessage = 'Trabajador eliminado correctamente';
            fetchFunction = fetchDataW;
            break;
        case 'location':
            endpoint = `https://mao-robotics.onrender.com/eliminarLugar/${currentDeleteId}`;
            successMessage = 'Lugar eliminado correctamente';
            fetchFunction = fetchDataL;
            break;
        case 'profession':
            endpoint = `https://mao-robotics.onrender.com/eliminarProfesion/${currentDeleteId}`;
            successMessage = 'Profesión eliminada correctamente';
            fetchFunction = fetchDataP;
            break;
        default:
            showNotification('Tipo de registro no válido', 'error');
            return;
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar');
        }
        document.getElementById('deleteModal').style.display = 'none';
        showNotification(successMessage, 'success');
        setTimeout(() => {
            fetchFunction();
        }, 100);
        
    } catch (error) {
        console.error('Error deleting:', error);
        showNotification(error.message || 'Error al eliminar registro', 'error');
    } finally {
        currentDeleteId = null;
        currentDeleteType = null;
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('notification--fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function obtenerEventListeners() {
    document.getElementById('obtenerTodosW')?.addEventListener('click', function(event) {
        event.preventDefault();
        fetchDataW(); 
    });
    document.getElementById('obtenerTodosL')?.addEventListener('click', function(event) {
        event.preventDefault();
        fetchDataL(); 
    });
    document.getElementById('obtenerTodosP')?.addEventListener('click', function(event) {
        event.preventDefault();
        fetchDataP(); 
    });
}

function editEventListeners (){
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action--edit-worker')) {
            const btn = e.target.closest('.action--edit-worker');
            editWorker(btn.dataset.id, btn.dataset.name);
        }
        if (e.target.closest('.action--edit-place')) {
            const btn = e.target.closest('.action--edit-place');
            editLocation(btn.dataset.id, btn.dataset.name);
        }
        if (e.target.closest('.action--edit-profession')) {
            const btn = e.target.closest('.action--edit-profession');
            editProfession(btn.dataset.id, btn.dataset.name);
        }
    });
}

function modalcloseandopenEventListeners (){
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close')) {
            e.target.closest('.modal').style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    modalcloseandopenEventListeners();
    obtenerEventListeners();
    editEventListeners();
    fetchAllData();
    searchWorkers();
    searchLocations();
    searchProfessions();
    addWorker();
    addLocation();
    addProfession();
});
