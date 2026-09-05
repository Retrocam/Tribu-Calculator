(function () {
var KCAL_PER_100G = 136;

  var nombreUsuarioInput = document.getElementById('nombre-usuario');
  var nombreMascotaInput = document.getElementById('nombre-mascota');
  var pesoInput = document.getElementById('peso');
  var edadValorInput = document.getElementById('edad-valor');
  var edadUnidadInput = document.getElementById('edad-unidad');

  var esterilizadoValue = 'si';
  var actividadValue = 'normal';

  var progressFill = document.getElementById('progress-fill');
  var btnBack = document.getElementById('btn-back');
  var btnNext = document.getElementById('btn-next');
  var btnRestart = document.getElementById('btn-restart');

  var resultTitle = document.getElementById('result-title');
  var resultGreeting = document.getElementById('result-greeting');
  var resultGrams = document.getElementById('result-grams');
  var resultPerMeal = document.getElementById('result-per-meal');
  var resultMealsCount = document.getElementById('result-meals-count');
  var resultPackages = document.getElementById('result-packages');

  // Botones de esterilización
  document.querySelectorAll('#esterilizado-choices .choice-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      esterilizadoValue = btn.dataset.value;
      document.querySelectorAll('#esterilizado-choices .choice-btn').forEach(function (b) {
        b.classList.toggle('selected', b === btn);
      });
    });
  });

  // Cards de nivel de actividad
  document.querySelectorAll('#actividad-choices .activity-card').forEach(function (card) {
    card.addEventListener('click', function () {
      actividadValue = card.dataset.value;
      document.querySelectorAll('#actividad-choices .activity-card').forEach(function (c) {
        c.classList.toggle('selected', c === card);
      });
    });
  });

  // Orden completo posible de pasos. "esterilizado" y "actividad" se filtran
  // dinámicamente si el perro resulta ser cachorro.
  var ALL_STEPS = ['nombre_usuario', 'nombre_mascota', 'raza', 'edad', 'peso', 'esterilizado', 'actividad', 'resultado'];
  var currentIndex = 0;

  function edadEnMeses() {
    var valor = parseFloat(edadValorInput.value);
    if (isNaN(valor)) return null;
    return edadUnidadInput.value === 'anios' ? valor * 12 : valor;
  }

  function getEtapa(meses) {
    if (meses === null) return null;
    if (meses < 4) return 'cachorro_temprano';
    if (meses < 12) return 'cachorro_tardio';
    return 'adulto';
  }

  function esCachorroActual() {
    var etapa = getEtapa(edadEnMeses());
    return etapa === 'cachorro_temprano' || etapa === 'cachorro_tardio';
  }

  // Devuelve la lista de pasos visibles según las respuestas actuales
  function getVisibleSteps() {
    if (esCachorroActual()) {
      return ALL_STEPS.filter(function (s) { return s !== 'esterilizado' && s !== 'actividad'; });
    }
    return ALL_STEPS.slice();
  }

  function getStepElement(stepName) {
    return document.querySelector('.step[data-step="' + stepName + '"]');
  }

  function updateProgress() {
    var visible = getVisibleSteps();
    var idx = visible.indexOf(ALL_STEPS[currentIndex]);
    var total = visible.length;
    var pct = ((idx + 1) / total) * 100;
    progressFill.style.width = pct + '%';
  }

  function showStep(index) {
    var visible = getVisibleSteps();
    var stepName = ALL_STEPS[index];

    // Si el paso actual ya no aplica (ej. se volvió cachorro), saltarlo
    if (visible.indexOf(stepName) === -1) {
      index = ALL_STEPS.indexOf(visible[Math.min(currentStepPositionFallback(index, visible), visible.length - 1)]);
    }

    document.querySelectorAll('.step').forEach(function (el) { el.classList.remove('active'); });
    getStepElement(ALL_STEPS[index]).classList.add('active');
    currentIndex = index;

    btnBack.style.visibility = (visible.indexOf(ALL_STEPS[index]) === 0) ? 'hidden' : 'visible';

    var isLast = ALL_STEPS[index] === 'resultado';
    btnNext.style.display = isLast ? 'none' : 'block';
    document.getElementById('nav-row').style.display = isLast ? 'none' : 'flex';

    updateProgress();
  }

  function currentStepPositionFallback(index, visible) {
    // ayuda a reubicar el índice cuando un paso deja de aplicar
    return 0;
  }

  function setError(fieldEl, hasError) {
    fieldEl.classList.toggle('has-error', hasError);
  }

  function validarPasoActual() {
    var stepName = ALL_STEPS[currentIndex];

    if (stepName === 'nombre_usuario') {
      var valido = nombreUsuarioInput.value.trim().length > 0;
      setError(document.getElementById('field-nombre-usuario'), !valido);
      return valido;
    }

    if (stepName === 'nombre_mascota') {
      var validoMascota = nombreMascotaInput.value.trim().length > 0;
      setError(document.getElementById('field-nombre-mascota'), !validoMascota);
      return validoMascota;
    }

    if (stepName === 'peso') {
      var peso = parseFloat(pesoInput.value);
      var pesoValido = !isNaN(peso) && peso > 0 && peso <= 100;
      setError(document.getElementById('field-peso'), !pesoValido);
      return pesoValido;
    }

    if (stepName === 'edad') {
      var meses = edadEnMeses();
      var edadValida = meses !== null && meses >= 0;
      setError(document.getElementById('field-edad-valor'), !edadValida);
      return edadValida;
    }

    // Raza, esterilizado y actividad siempre tienen un valor por defecto válido
    return true;
  }

  function calcularGramos(pesoKg) {
    var meses = edadEnMeses();
    var etapa = getEtapa(meses);
    var rer = 70 * Math.pow(pesoKg, 0.75);
    var factorTotal;

    if (etapa === 'cachorro_temprano') {
      factorTotal = 3.0;
    } else if (etapa === 'cachorro_tardio') {
      factorTotal = 2.0;
    } else {
      var factorEsterilizacion = esterilizadoValue === 'si' ? 1.6 : 1.8;
      var ajusteActividad = { sedentario: 0.8, normal: 1.0, activo: 1.2 }[actividadValue];
      factorTotal = factorEsterilizacion * ajusteActividad;
    }

    var mer = rer * factorTotal;
    return Math.round((mer / KCAL_PER_100G) * 100);
  }

  function getComidasPorDia(etapa) {
    if (etapa === 'cachorro_temprano') return 4;
    if (etapa === 'cachorro_tardio') return 3;
    return 2;
  }

  // Presentaciones disponibles del producto, de mayor a menor tamaño (en gramos)
  var PACKAGE_SIZES = [600, 300];

  function calcularPaquetes(gramos) {
    var sizes = PACKAGE_SIZES;
    var best = null;

    function evaluar(counts, total) {
      if (total < gramos) return;
      var totalCount = counts.reduce(function (a, b) { return a + b; }, 0);
      var excess = total - gramos;
      var mejorQueElActual =
        !best ||
        excess < best.excess ||
        (excess === best.excess && totalCount < best.totalCount);
      if (mejorQueElActual) {
        best = { counts: counts.slice(), total: total, excess: excess, totalCount: totalCount };
      }
    }

    function buscar(index, counts, total) {
      // Cortar ramas que ya se pasan de más de un paquete extra del tamaño mayor
      if (total > gramos + sizes[0]) return;

      if (index === sizes.length) {
        evaluar(counts, total);
        return;
      }

      var maxCantidad = Math.ceil(gramos / sizes[index]) + 1;
      for (var c = 0; c <= maxCantidad; c++) {
        counts.push(c);
        buscar(index + 1, counts, total + c * sizes[index]);
        counts.pop();
      }
    }

    buscar(0, [], 0);

    var partes = [];
    sizes.forEach(function (size, i) {
      var cantidad = best.counts[i];
      if (cantidad > 0) {
        var etiqueta = cantidad === 1 ? 'paquete' : 'paquetes';
        partes.push(cantidad + ' ' + etiqueta + ' de ' + size + 'g');
      }
    });

    return partes.join(' + ');
  }

  function mostrarResultado() {
    var peso = parseFloat(pesoInput.value);
    var etapa = getEtapa(edadEnMeses());
    var gramos = calcularGramos(peso);
    var comidas = getComidasPorDia(etapa);
    var porComida = Math.round(gramos / comidas);

    var nombreUsuario = nombreUsuarioInput.value.trim();
    var nombreMascota = nombreMascotaInput.value.trim();

    resultTitle.textContent = 'El plan de ' + nombreMascota;
    resultGreeting.textContent = 'Hola ' + nombreUsuario + ', te recomendamos darle a ' + nombreMascota + ':';

    resultGrams.textContent = gramos.toLocaleString('es-CO');
    resultPerMeal.textContent = porComida.toLocaleString('es-CO') + ' g';
    resultMealsCount.textContent = comidas;
    resultPackages.innerHTML = 'Equivale aprox. a <strong>' + calcularPaquetes(gramos) + '</strong> al día';
  }

  function irAlSiguientePaso() {
    if (!validarPasoActual()) return;

    var visible = getVisibleSteps();
    var stepName = ALL_STEPS[currentIndex];
    var posEnVisibles = visible.indexOf(stepName);
    var siguienteNombre = visible[posEnVisibles + 1];

    if (siguienteNombre === 'resultado') {
      mostrarResultado();
    }

    showStep(ALL_STEPS.indexOf(siguienteNombre));
  }

  function irAlPasoAnterior() {
    var visible = getVisibleSteps();
    var stepName = ALL_STEPS[currentIndex];
    var posEnVisibles = visible.indexOf(stepName);
    if (posEnVisibles <= 0) return;
    var anteriorNombre = visible[posEnVisibles - 1];
    showStep(ALL_STEPS.indexOf(anteriorNombre));
  }

  function resetForm() {
    nombreUsuarioInput.value = '';
    nombreMascotaInput.value = '';
    pesoInput.value = '';
    edadValorInput.value = '';
    edadUnidadInput.value = 'meses';
    document.getElementById('raza').value = '';

    esterilizadoValue = 'si';
    document.querySelectorAll('#esterilizado-choices .choice-btn').forEach(function (b) {
      b.classList.toggle('selected', b.dataset.value === 'si');
    });

    actividadValue = 'normal';
    document.querySelectorAll('#actividad-choices .activity-card').forEach(function (c) {
      c.classList.toggle('selected', c.dataset.value === 'normal');
    });

    document.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error'); });

    showStep(0);
  }

  btnNext.addEventListener('click', irAlSiguientePaso);
  btnBack.addEventListener('click', irAlPasoAnterior);
  btnRestart.addEventListener('click', resetForm);

  // Permitir avanzar con Enter dentro de un input
  document.getElementById('calc-form').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      irAlSiguientePaso();
    }
  });

  showStep(0);
})();