window.onload = function() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.value = '';
  });
};
function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach(div => {
    div.classList.remove("active");
  });
  document.getElementById(tab).classList.add("active");
}

// Interface Simple : Z → A et B
function calculSimple() {
  const z = parseFloat(document.getElementById("z-simple").value) || 0;
  document.getElementById("a-simple").textContent = (((299792.458*((z+1)*(z+1)-1)/((z+1)*(z+1)+1))*30856775814913711000)/71).toFixed(2);
  document.getElementById("b-simple").textContent = (z + 5).toFixed(2);
}

// Interface Avancée : calculs bidirectionnels
// script.js

// Constantes physiques
const c = 299792.458;
const L = 30856775814913711000;
const AS = 31558150;
const lambRef = 6.5628e-7;
const Vex = 71;
const Tex = 71;

const V2 = (4 / 3) * Math.PI * Math.pow(c / Tex, 3);

function handleInput(type) {
  const value = parseFloat(document.getElementById(type).value);
  if (isNaN(value)) return;

  const result = calculerDepuis(type, value);

  for (const key in result) {
    if (key !== type && document.getElementById(key)) {
      document.getElementById(key).value = result[key].toFixed(6);
    }
  }
}
function calculerDepuis(typ, val) {
  let z, zexp, Vrec, Ri, Ra, Rm, te, T, x, f, lambda, V, temp;

  // Initialisation en fonction du type saisi
  switch (typ) {
    case "f":
      f = val;
      lambda = c * 1e3 / f;
      z = lambda / lambRef - 1;
      break;
    case "lambda":
      lambda = val;
      z = lambda / lambRef - 1;
      break;
    case "z":
      z = val;
      break;
    case "zexp":
      zexp = val;
      z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
      break;
    case "Vrec":
      Vrec = val;
      zexp = Vrec / c;
      z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
      break;
    case "Ri":
	  Ri = val;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
    case "Ra":
	  Ra = val;
	  Ri = Ra * c * AS;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
    case "Rm":
	  Rm = val;
	  Ri = Rm * L;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
    case "te":
	  te = val;
	  T = te / AS;
	  Ri = Math.exp((te * Vex) / L) - 1;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
    case "T":
	  T = val;
	  te = T * AS;
	  Ri = Math.exp((te * Vex) / L) - 1;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
    case "x":
	  x = val;
	  T = 732974068759 - x;
	  te = T * AS;
	  Ri = Math.exp((te * Vex) / L) - 1;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
    case "V":
	  V = val;
	  Rm = Math.pow((3 * V) / (4 * Math.PI), 1 / 3);
	  Ri = Rm * L;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
    case "temp":
	  temp = val;
	  V = Math.pow((2.725 * Math.pow(V2, 2 / 3)) / temp, 3 / 2);
	  Rm = Math.pow((3 * V) / (4 * Math.PI), 1 / 3);
	  Ri = Rm * L;
	  Vrec = Ri * Vex / L;
	  zexp = Vrec / c;
	  z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
	  break;
  }

  // Recalcul complet et propagation des variables  
  // 1) z et zexp  
  if (z === undefined && zexp !== undefined) {
    z = Math.sqrt((1 + zexp) / (1 - zexp)) - 1;
  }
  if (zexp === undefined && z !== undefined) {
    zexp = ((z + 1) ** 2 - 1) / ((z + 1) ** 2 + 1);
  }

  // 2) Vrec  
  if (Vrec === undefined && zexp !== undefined) {
    Vrec = c * zexp;
  }

  // 3) Ri  
  if (Ri === undefined && Vrec !== undefined) {
    Ri = Vrec * (L / Vex);
  }

  // 4) Ra, Rm  
  if (Ra === undefined && Ri !== undefined) {
    Ra = Ri / (c * AS);
  }
  if (Rm === undefined && Ri !== undefined) {
    Rm = Ri / L;
  }

  // 5) te et T  
  if (te === undefined && Ri !== undefined) {
    te = Math.log(Ri + 1) * (L / Vex);
  }
  if (T === undefined && te !== undefined) {
    T = te / AS;
  }

  // 6) x  
  if (x === undefined && T !== undefined) {
    x = 732974068759 - T;
  }

  // 7) lambda et f  
  if (lambda === undefined && z !== undefined) {
    lambda = lambRef * (z + 1);
  }
  if (f === undefined && lambda !== undefined) {
    f = c * 1e3 / lambda;
  }

  // 8) V  
  if (V === undefined && Rm !== undefined) {
    V = (4 / 3) * Math.PI * Math.pow(Rm, 3);
  }

  // 9) temp  
  if (temp === undefined && V !== undefined) {
    temp = 2.725 * Math.pow(V2 / V, 2 / 3);
  }

  return { z, zexp, Vrec, Ri, Ra, Rm, te, T, x, f, lambda, V, temp };
}
