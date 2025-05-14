async function loadModals() {
  try {
    const [workerModal, placeModal, professionModal, deleteModal] = await Promise.all([
      fetch('./html/edit/edit-worker.html').then(res => res.text()),
      fetch('./html/edit/edit-place.html').then(res => res.text()),
      fetch('./html/edit/edit-profession.html').then(res => res.text()),
      fetch('./html/delete.html').then(res => res.text())
    ]);
    document.getElementById('modals-container').innerHTML = 
      workerModal + placeModal + professionModal + deleteModal;
  } catch (error) {
    console.error('Error cargando modales:', error);
    showNotification('Error al cargar interfaces', 'error');
  }
}

let deleteId = null;
let deleteType = null;

function setupModalEvents() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.action--edit-worker')) {
      e.preventDefault();
      document.getElementById('editWorkerModal').style.display = 'flex';
    }
    
    if (e.target.closest('.action--edit-place')) {
      e.preventDefault();
      document.getElementById('editPlaceModal').style.display = 'flex';
    }
    
    if (e.target.closest('.action--edit-profession')) {
      e.preventDefault();
      document.getElementById('editProfessionModal').style.display = 'flex';
    }
    
    if (e.target.closest('.action--delete')) {
      e.preventDefault();
      const btn = e.target.closest('.action--delete');
      const row = btn.closest('tr');
      deleteId = btn.dataset.id;
      
      if (row.closest('#workerData')) deleteType = 'worker';
      else if (row.closest('#locationData')) deleteType = 'location';
      else if (row.closest('#professionData')) deleteType = 'profession';
      
      document.getElementById('deleteModal').style.display = 'flex';
    }
    if (e.target.closest('#deleteModal .btn--light')) { 
      e.preventDefault();
      document.getElementById('deleteModal').style.display = 'none';
    }

    if (e.target.closest('#deleteModal .btn--primary')) {
      e.preventDefault();
      deleteFunction();
    }
    
    if (e.target.classList.contains('close') || e.target.classList.contains('modal')) {
      e.target.closest('.modal').style.display = 'none';
    }
  });
}

async function deleteFunction() {
  if (!deleteId || !deleteType) return;

  const endpoints = {
    worker: `https://mao-robotics.onrender.com/eliminarTrabajador/${deleteId}`,
    location: `https://mao-robotics.onrender.com/eliminarLugar/${deleteId}`,
    profession: `https://mao-robotics.onrender.com/eliminarProfesion/${deleteId}`
  };

  const updateFunctions = {
    worker: fetchDataW,
    location: fetchDataL,
    profession: fetchDataP
  };

  try {
    const response = await fetch(endpoints[deleteType], { method: 'DELETE' });
    
    if (!response.ok) throw new Error('Error al eliminar');

    document.getElementById('deleteModal').style.display = 'none';
    showNotification('Registro eliminado correctamente', 'success');
    updateFunctions[deleteType]();
    
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error al eliminar registro', 'error');
  } finally {
    deleteId = null;
    deleteType = null;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadModals().then(setupModalEvents);
});