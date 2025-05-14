document.addEventListener('DOMContentLoaded', function() {
    fetchAllData();
    setupTabs();
});


function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

async function fetchAllData() {
    try {
        await Promise.all([
            fetchCompatibilities(),
            fetchAndroids(),
            fetchPhsycos(),
            fetchTraits(),
            fetchAccesories(),
            fetchCategories()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error al cargar datos iniciales', 'error');
    }
}


async function fetchCompatibilities() {
    try {
        const response = await fetch('https://maomsql.onrender.com/compatibility', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error de conexión');
        }

        const data = await response.json();
        const tableBody = document.getElementById('compatibilityData');
        tableBody.innerHTML = ''; 
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id || ''}</td>
                <td>${item.modelVersion || ''}</td>
                <td>${item.description || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching compatibilities:', error);
        showNotification('Error al cargar compatibilidades', 'error');
    }
}

async function searchCompatibilityByModel(modelVersion) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/compatibilitybymodel/${modelVersion}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const tableBody = document.getElementById('compatibilityData');
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id || ''}</td>
                <td>${item.modelVersion || ''}</td>
                <td>${item.description || ''}</td>
                <td>
                    <button class="action action--edit" data-id="${item.id}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${item.id}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching compatibilities by model:', error);
        showNotification('Error al buscar compatibilidades por modelo', 'error');
    }
}


async function getCompatibilityById(id) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/compatibilitybyid/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        
        
        document.getElementById('edit-compatibility-id').value = data.id;
        document.getElementById('edit-compatibility-model').value = data.modelVersion;
        document.getElementById('edit-compatibility-description').value = data.description;
        
        document.getElementById('editCompatibilityModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Error getting compatibility by ID:', error);
        showNotification('Error al obtener compatibilidad por ID', 'error');
    }
}


async function createCompatibility(modelVersion, description) {
    try {
        const response = await fetch('https://maomsql.onrender.com/createcompatibility', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modelVersion, description }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear compatibilidad');
        }

        showNotification('Compatibilidad creada exitosamente', 'success');
        fetchCompatibilities(); 
        
    } catch (error) {
        console.error('Error creating compatibility:', error);
        showNotification(error.message || 'Error al crear compatibilidad', 'error');
    }
}


async function deleteCompatibility(id) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/deletecompatibility/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar compatibilidad');
        }

        showNotification('Compatibilidad eliminada exitosamente', 'success');
        fetchCompatibilities(); // Refrescar la tabla
        
    } catch (error) {
        console.error('Error deleting compatibility:', error);
        showNotification(error.message || 'Error al eliminar compatibilidad', 'error');
    }
}

async function updateCompatibility(id, modelVersion, description) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/modifiyCompatibility/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modelVersion, description }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar compatibilidad');
        }

        showNotification('Compatibilidad actualizada exitosamente', 'success');
        fetchCompatibilities(); // Refrescar la tabla
        
    } catch (error) {
        console.error('Error updating compatibility:', error);
        showNotification(error.message || 'Error al actualizar compatibilidad', 'error');
    }
}


async function fetchAndroids() {
    try {
        const response = await fetch('https://maomsql.onrender.com/MAO_ROBOTICS/androids/traertodos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error de conexión');
        }

        const data = await response.json();
        const tableBody = document.getElementById('androidsData');
        tableBody.innerHTML = '';
        
        data.forEach(android => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${android.id || ''}</td>
                <td>${android.name || ''}</td>
                <td>${android.description || ''}</td>
                <td>${android.warrantyYears || ''} años</td>
                <td>${android.price ? android.price.toLocaleString('es-ES', {style: 'currency', currency: 'COP'}) : ''}</td>
                <td>${android.img ? `<img src="${android.img}" alt="${android.name}" class="android-img">` : ''}</td>
                <td>${android.id_Color || ''}</td>
                <td>${android.id_Task || ''}</td>
                <td>${android.id_ModelComp || ''}</td>
                <td>${android.id_PHSYCO || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching androids:', error);
        showNotification('Error al cargar androides', 'error');
    }
}

async function searchAndroidByName(name) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/MAO_ROBOTICS/androids/traerconNombre/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const tableBody = document.getElementById('androidsData');
        tableBody.innerHTML = '';
        
        data.forEach(android => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${android.id || ''}</td>
                <td>${android.name || ''}</td>
                <td>${android.description || ''}</td>
                <td>${android.warrantyYears || ''}</td>
                <td>${android.price ? android.price.toLocaleString('es-ES', {style: 'currency', currency: 'COP'}) : ''}</td>
                <td>${android.id_Color || ''}</td>
                <td>${android.id_Task || ''}</td>
                <td>${android.id_ModelComp || ''}</td>
                <td>${android.id_PHSYCO || ''}</td>
                <td>
                    <button class="action action--edit" data-id="${android.id}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${android.id}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching androids by name:', error);
        showNotification('Error al buscar androides por nombre', 'error');
    }
}


async function getAndroidById(id) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/MAO_ROBOTICS/androids/traerPorID/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        
        
        document.getElementById('edit-android-id').value = data.id;
        document.getElementById('edit-android-name').value = data.name;
        document.getElementById('edit-android-description').value = data.description;
        document.getElementById('edit-android-img').value = data.img;
        document.getElementById('edit-android-warranty').value = data.warrantyYears;
        document.getElementById('edit-android-price').value = data.price;
        document.getElementById('edit-android-color').value = data.id_Color;
        document.getElementById('edit-android-task').value = data.id_Task;
        document.getElementById('edit-android-model').value = data.id_ModelComp;
        document.getElementById('edit-android-phsyco').value = data.id_PHSYCO;
        
        document.getElementById('editAndroidModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Error getting android by ID:', error);
        showNotification('Error al obtener android por ID', 'error');
    }
}


async function searchAndroidByColor(colorId) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/MAO_ROBOTICS/androids/traerPorColor/${colorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const tableBody = document.getElementById('androidsData');
        tableBody.innerHTML = '';
        
        data.forEach(android => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${android.id || ''}</td>
                <td>${android.name || ''}</td>
                <td>${android.description || ''}</td>
                <td>${android.warrantyYears || ''}</td>
                <td>${android.price ? android.price.toLocaleString('es-ES', {style: 'currency', currency: 'COP'}) : ''}</td>
                <td>${android.id_Color || ''}</td>
                <td>${android.id_Task || ''}</td>
                <td>${android.id_ModelComp || ''}</td>
                <td>${android.id_PHSYCO || ''}</td>
                <td>
                    <button class="action action--edit" data-id="${android.id}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${android.id}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching androids by color:', error);
        showNotification('Error al buscar androides por color', 'error');
    }
}


async function searchAndroidByTaskAndModel(taskId, modelId) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/MAO_ROBOTICS/androids/obtenerPorTaskYModelo/${taskId}/${modelId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const tableBody = document.getElementById('androidsData');
        tableBody.innerHTML = '';
        
        data.forEach(android => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${android.id || ''}</td>
                <td>${android.name || ''}</td>
                <td>${android.description || ''}</td>
                <td>${android.warrantyYears || ''}</td>
                <td>${android.price ? android.price.toLocaleString('es-ES', {style: 'currency', currency: 'COP'}) : ''}</td>
                <td>${android.id_Color || ''}</td>
                <td>${android.id_Task || ''}</td>
                <td>${android.id_ModelComp || ''}</td>
                <td>${android.id_PHSYCO || ''}</td>
                <td>
                    <button class="action action--edit" data-id="${android.id}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${android.id}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching androids by task and model:', error);
        showNotification('Error al buscar androides por tarea y modelo', 'error');
    }
}


async function createAndroid(androidData) {
    try {
        const response = await fetch('https://maomsql.onrender.com/MAO_ROBOTICS/androids/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(androidData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear android');
        }

        showNotification('Android creado exitosamente', 'success');
        fetchAndroids();
        
    } catch (error) {
        console.error('Error creating android:', error);
        showNotification(error.message || 'Error al crear android', 'error');
    }
}


async function deleteAndroid(id) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/MAO_ROBOTICS/androids/eliminar/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar android');
        }

        showNotification('Android eliminado exitosamente', 'success');
        fetchAndroids();
        
    } catch (error) {
        console.error('Error deleting android:', error);
        showNotification(error.message || 'Error al eliminar android', 'error');
    }
}


async function updateAndroid(id, androidData) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/MAO_ROBOTICS/androids/actualizar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(androidData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar android');
        }

        showNotification('Android actualizado exitosamente', 'success');
        fetchAndroids();
        
    } catch (error) {
        console.error('Error updating android:', error);
        showNotification(error.message || 'Error al actualizar android', 'error');
    }
}


async function fetchPhsycos() {
    try {
        const response = await fetch('https://maomsql.onrender.com/mao-robotics/phsyco/getall', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Error de conexión');
        }

        const data = await response.json();
        const tableBody = document.getElementById('phsycosData');
        tableBody.innerHTML = '';
        
        data.forEach(phsyco => {
            const row = document.createElement('tr');
            
            
            const positiveTraits = phsyco.rasgos_positivos?.map(t => t.rasgo).join(', ') || 'N/A';
            
            
            const negativeTraits = phsyco.rasgos_negativos?.map(t => t.rasgo).join(', ') || 'N/A';
            
            
            const intelligenceTypes = phsyco.Tipo_Inteligencia?.map(t => t.tipo).join(', ') || 'N/A';
            
            const colors = phsyco.Color?.map(c => `${c.color} (${c.codigo_hexadecimal})`).join(', ') || 'N/A';

            row.innerHTML = `
                <td>${phsyco.id_phsyco || ''}</td>
                <td>${phsyco.nombre || ''}</td>
                <td>${phsyco.descripcion || ''}</td>
                <td>${phsyco.corrupcion || ''}</td>
                <td>${positiveTraits}</td>
                <td>${negativeTraits}</td>
                <td>${intelligenceTypes}</td>
                <td>${colors}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching phsycos:', error);
        showNotification('Error al cargar phsycos', 'error');
    }
}


async function getPhsycoById(id) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/mao-robotics/phsyco/getbyid/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        
        
        document.getElementById('edit-phsyco-id').value = data.id_phsyco;
        document.getElementById('edit-phsyco-name').value = data.nombre;
        document.getElementById('edit-phsyco-description').value = data.descripcion;
        document.getElementById('edit-phsyco-corruption').value = data.corrupcion;
        
        document.getElementById('editPhsycoModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Error getting phsyco by ID:', error);
        showNotification('Error al obtener phsyco por ID', 'error');
    }
}


async function searchPhsycosByNameAndCorruption(name, corruption) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/mao-robotics/phsyco/getby-name-corruption-greater-than/${name}/${corruption}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const tableBody = document.getElementById('phsycosData');
        tableBody.innerHTML = '';
        
        data.forEach(phsyco => {
            const row = document.createElement('tr');
            
            const positiveTraits = phsyco.rasgos_positivos?.map(t => t.rasgo).join(', ') || 'N/A';
            const negativeTraits = phsyco.rasgos_negativos?.map(t => t.rasgo).join(', ') || 'N/A';
            const intelligenceTypes = phsyco.Tipo_Inteligencia?.map(t => t.tipo).join(', ') || 'N/A';
            const colors = phsyco.Color?.map(c => `${c.color} (${c.codigo_hexadecimal})`).join(', ') || 'N/A';

            row.innerHTML = `
                <td>${phsyco.id_phsyco || ''}</td>
                <td>${phsyco.nombre || ''}</td>
                <td>${phsyco.descripcion || ''}</td>
                <td>${phsyco.corrupcion || ''}</td>
                <td>${positiveTraits}</td>
                <td>${negativeTraits}</td>
                <td>${intelligenceTypes}</td>
                <td>${colors}</td>
                <td>
                    <button class="action action--edit" data-id="${phsyco.id_phsyco}">
                        <i class="fi fi-ss-edit"></i>
                    </button>
                    <button class="action action--delete" data-id="${phsyco.id_phsyco}">
                        <i class="fi fi-ss-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching phsycos:', error);
        showNotification('Error al buscar phsycos', 'error');
    }
}


async function createPhsyco(phsycoData) {
    try {
        const response = await fetch('https://maomsql.onrender.com/mao-robotics/phsyco/createphsyco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(phsycoData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear phsyco');
        }

        const result = await response.json();
        showNotification(`Phsyco creado exitosamente. ID: ${result.insertId || ''}`, 'success');
        fetchPhsycos(); 
        
    } catch (error) {
        console.error('Error creating phsyco:', error);
        showNotification(error.message || 'Error al crear phsyco', 'error');
    }
}


async function setPhsycoTraits(phsycoId, positiveTraitId, negativeTraitId) {
    try {
        const response = await fetch('https://maomsql.onrender.com/mao-robotics/phsycotraits/set-traits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: phsycoId,
                id_PTrait: positiveTraitId,
                id_NTrait: negativeTraitId
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al asignar rasgos');
        }

        showNotification('Rasgos asignados exitosamente', 'success');
        fetchPhsycos();
        
    } catch (error) {
        console.error('Error setting traits:', error);
        showNotification(error.message || 'Error al asignar rasgos', 'error');
    }
}


async function deletePhsyco(id) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/mao-robotics/phsyco/remove-phsyco/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar phsyco');
        }

        showNotification('Phsyco eliminado exitosamente', 'success');
        fetchPhsycos(); // Refrescar la tabla
        
    } catch (error) {
        console.error('Error deleting phsyco:', error);
        showNotification(error.message || 'Error al eliminar phsyco', 'error');
    }
}


async function changePhsycoCorruption(id, corruptionLevel) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/mao-robotics/phsyco/changeCorruption/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ corruption: corruptionLevel }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar corrupción');
        }

        showNotification('Nivel de corrupción actualizado', 'success');
        fetchPhsycos();
        
    } catch (error) {
        console.error('Error changing corruption:', error);
        showNotification(error.message || 'Error al actualizar corrupción', 'error');
    }
}


async function fetchTraits() {
    try {
        const response = await fetch('https://maomsql.onrender.com/mao-robotics/traits/getall', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Error de conexión');
        }

        const data = await response.json();
        const tableBody = document.getElementById('traitsData');
        tableBody.innerHTML = '';
        
        
        if (data[0] && data[0].rasgos_positivos && data[0].rasgos_positivos.length > 0) {
            data[0].rasgos_positivos.forEach(trait => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${trait.id || ''}</td>
                    <td>${trait.name || ''}</td>
                    <td>Positivo</td>
                    <td>${trait.id_IntelType || ''}</td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        
        if (data[0] && data[0].rasgos_negativos && data[0].rasgos_negativos.length > 0) {
            data[0].rasgos_negativos.forEach(trait => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${trait.id || ''}</td>
                    <td>${trait.name || ''}</td>
                    <td>Negativo</td>
                    <td>${trait.id_IntelType || ''}</td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error fetching traits:', error);
        showNotification('Error al cargar rasgos', 'error');
    }
}


async function fetchAccesories() {
    try {
        const response = await fetch('https://maomsql.onrender.com/Accesories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const tableBody = document.getElementById('accesoriesData');
        tableBody.innerHTML = '';
        
        data.forEach(accesory => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${accesory.id || ''}</td>
                <td>${accesory.name || ''}</td>
                <td>${accesory.description || ''}</td>
                <td>${accesory.price ? accesory.price.toLocaleString('es-ES', {style: 'currency', currency: 'COP'}) : ''}</td>
                <td>${accesory.id_ModelComp || ''}</td>
                <td>${accesory.warrantyYears || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching accesories:', error);
        showNotification('Error al cargar accesorios', 'error');
    }
}

async function searchAccessoriesByModelAndWarranty(modelId, warrantyYears) {
    try {
        const response = await fetch(`https://maomsql.onrender.com/Accesoriesdetails/${modelId}/${warrantyYears}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Error de conexión');

        const data = await response.json();
        const tableBody = document.getElementById('accesoriesData');
        tableBody.innerHTML = '';
        
        data.forEach(accesory => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${accesory.id || ''}</td>
                <td>${accesory.name || ''}</td>
                <td>${accesory.description || ''}</td>
                <td>${accesory.price ? accesory.price.toLocaleString('es-ES', {style: 'currency', currency: 'COP'}) : ''}</td>
                <td>${accesory.id_ModelComp || ''}</td>
                <td>${accesory.warrantyYears || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error searching accessories:', error);
        showNotification('Error al buscar accesorios', 'error');
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('https://maomsql.onrender.com/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error de conexión');
        }

        const data = await response.json();
        const tableBody = document.getElementById('categoriesData');
        tableBody.innerHTML = '';
        
        data.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.id || ''}</td>
                <td>${category.name || ''}</td>
                <td>${category.description || ''}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        showNotification('Error al cargar categorías', 'error');
    }
}


function setupCompatibilityEvents() {
    
    document.getElementById('search-compatibility-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const modelVersion = document.getElementById('search-compatibility-model').value;
        await searchCompatibilityByModel(modelVersion);
    });
    
    
    document.getElementById('create-compatibility-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const modelVersion = document.getElementById('new-compatibility-model').value;
        const description = document.getElementById('new-compatibility-description').value;
        await createCompatibility(modelVersion, description);
        e.target.reset();
    });
    
    
    document.getElementById('edit-compatibility-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-compatibility-id').value;
        const modelVersion = document.getElementById('edit-compatibility-model').value;
        const description = document.getElementById('edit-compatibility-description').value;
        await updateCompatibility(id, modelVersion, description);
        document.getElementById('editCompatibilityModal').style.display = 'none';
    });
    
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action--edit')) {
            const id = e.target.closest('.action--edit').dataset.id;
            getCompatibilityById(id);
        }
        
        if (e.target.closest('.action--delete')) {
            const id = e.target.closest('.action--delete').dataset.id;
            if (confirm('¿Estás seguro de eliminar esta compatibilidad?')) {
                deleteCompatibility(id);
            }
        }
    });
}


function setupAndroidEvents() {
    
    document.getElementById('search-android-name-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('search-android-name').value;
        await searchAndroidByName(name);
    });
    
    
    document.getElementById('search-android-color-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const colorId = document.getElementById('search-android-color').value;
        await searchAndroidByColor(colorId);
    });
    
    
    document.getElementById('search-android-task-model-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskId = document.getElementById('search-android-task').value;
        const modelId = document.getElementById('search-android-model').value;
        await searchAndroidByTaskAndModel(taskId, modelId);
    });
    
    
    document.getElementById('create-android-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const androidData = {
            name: document.getElementById('new-android-name').value,
            description: document.getElementById('new-android-description').value,
            img: document.getElementById('new-android-img').value,
            warrantyYears: document.getElementById('new-android-warranty').value,
            price: document.getElementById('new-android-price').value,
            id_Color: document.getElementById('new-android-color').value,
            id_Task: document.getElementById('new-android-task').value,
            id_ModelComp: document.getElementById('new-android-model').value,
            id_PHSYCO: document.getElementById('new-android-phsyco').value
        };
        await createAndroid(androidData);
        e.target.reset();
    });
    
   
    document.getElementById('edit-android-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-android-id').value;
        const androidData = {
            name: document.getElementById('edit-android-name').value,
            description: document.getElementById('edit-android-description').value,
            img: document.getElementById('edit-android-img').value,
            warrantyYears: document.getElementById('edit-android-warranty').value,
            price: document.getElementById('edit-android-price').value,
            id_Color: document.getElementById('edit-android-color').value,
            id_Task: document.getElementById('edit-android-task').value,
            id_ModelComp: document.getElementById('edit-android-model').value,
            id_PHSYCO: document.getElementById('edit-android-phsyco').value
        };
        await updateAndroid(id, androidData);
        document.getElementById('editAndroidModal').style.display = 'none';
    });
    
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action--edit')) {
            const id = e.target.closest('.action--edit').dataset.id;
            getAndroidById(id);
        }
        
        if (e.target.closest('.action--delete')) {
            const id = e.target.closest('.action--delete').dataset.id;
            if (confirm('¿Estás seguro de eliminar este android?')) {
                deleteAndroid(id);
            }
        }
    });
}


function setupPhsycoEvents() {
    
    document.getElementById('search-phsyco-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('search-phsyco-name').value;
        const corruption = document.getElementById('search-phsyco-corruption').value;
        await searchPhsycosByNameAndCorruption(name, corruption);
    });
    
    
    document.getElementById('create-phsyco-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phsycoData = {
            name: document.getElementById('new-phsyco-name').value,
            description: document.getElementById('new-phsyco-description').value,
            corruption: document.getElementById('new-phsyco-corruption').value,
            id_PTrait: document.getElementById('new-phsyco-ptrait').value,
            id_NTrait: document.getElementById('new-phsyco-ntrait').value
        };
        await createPhsyco(phsycoData);
        e.target.reset();
    });
    
    
    document.getElementById('set-traits-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phsycoId = document.getElementById('set-traits-phsyco-id').value;
        const positiveTrait = document.getElementById('set-traits-positive').value;
        const negativeTrait = document.getElementById('set-traits-negative').value;
        await setPhsycoTraits(phsycoId, positiveTrait, negativeTrait);
        e.target.reset();
    });
    
    
    document.getElementById('edit-phsyco-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-phsyco-id').value;
        const corruption = document.getElementById('edit-phsyco-corruption').value;
        await changePhsycoCorruption(id, corruption);
        document.getElementById('editPhsycoModal').style.display = 'none';
    });
    
   
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action--edit')) {
            const id = e.target.closest('.action--edit').dataset.id;
            getPhsycoById(id);
        }
        
        if (e.target.closest('.action--delete')) {
            const id = e.target.closest('.action--delete').dataset.id;
            if (confirm('¿Estás seguro de eliminar este phsyco?')) {
                deletePhsyco(id);
            }
        }
    });
}

function setupAccessoryEvents() {
    // Buscar por modelo y garantía
    document.getElementById('search-accessory-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const modelId = document.getElementById('search-accessory-model').value;
        const warrantyYears = document.getElementById('search-accessory-warranty').value;
        await searchAccessoriesByModelAndWarranty(modelId, warrantyYears);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    setupCompatibilityEvents();
});


document.addEventListener('DOMContentLoaded', () => {
    setupAndroidEvents();
});

document.addEventListener('DOMContentLoaded', () => {
    setupPhsycoEvents();
});

document.addEventListener('DOMContentLoaded', () => {
    setupAccessoryEvents();
});

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