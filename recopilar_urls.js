(()=>{

    // Referencias
    let me = null;
    let divTitulo = null;
    let ulLista = null;
    let spanNumero = null;

    
    
    let dat = {

        datos: [],

        load: function() {
            // En el Storage sólo se pueden guardar strings
            let strDatos = localStorage.getItem("urls") || '[]';
            // Convertimos en objeto
            this.datos = JSON.parse(strDatos);
            console.log(this.datos);
        },
        
        save: function() {
            localStorage.setItem("urls", JSON.stringify([...new Set(this.datos)]));
        },

        drop: function() {
            localStorage.removeItem("urls");
        },

        del: function(id) {
            // Eliminamos el registro que tiene el Id indicado
            this.datos = this.datos.filter(o => String(o.Id)!==String(id));
        },
        
        set: function(objeto) {
            // Vemos si el objeto tiene un Id y es mayor de cero
            let id = objeto.Id;
            if("Id" in objeto && objeto.Id>0) {
                // Si es que SÍ, vamos a editar, así que eliminamos el registro antiguo y guardaremos con el mismo Id que tiene el objeto
                this.del(objeto.Id);
            } else {
                // Si es que NO, se trata de un objeto nuevo, así que calculamos cuál es el último Id usado y sumamos uno
                id = Math.max(0, ...this.datos.map(o => o.Id)) + 1;
            };
            // Clonamos el objeto para evitar relaciones y metemos el Id que le corresponda
            let registro = { ...JSON.parse(JSON.stringify(objeto)), Id: id };
            // Lo metemos al array de datos
            this.datos.push(registro);
        },
        
    };

    
    
    function VentanaUrls__crear() {
       
        // Creamos un DIV para meter dentro lo necesario
        let div = document.createElement("div");
        div.setAttribute("id", "VentanaUrls");
        let html = "";
        html += `<div id="VentanaUrls_Titulo" class="titulo">`;
        html += `<b>Lista de URLs</b>`;
        html += `<span style="float:right">`;
        html += ` <span id="VentanaUrls_Titulo_Numero">-</span>`;
        html += ` <a id="VentanaUrls_Titulo_btnAgregar" href="javascript:void(0)" class="btn-verde">Agregar</a>`;
        html += ` <a id="VentanaUrls_Titulo_btnCopiar" href="javascript:void(0)" class="btn-amarillo">Copiar</a>`;
        html += ` <a id="VentanaUrls_Titulo_btnBorrar" href="javascript:void(0)" class="btn-rojo">Borrar</a>`;
        html += `<span>`;
        html += `</div>`;
        html += `<div id="VentanaUrls_Lista" class="lista"><ul id="VentanaUrls_Lista_Ul"></ul></div>`;
        div.innerHTML = html;
        
        // Creamos ahora un STYLE para darle los estilos
        let style = document.createElement("style");
        style.setAttribute("id", "VentanaUrls_style");
        let estilos = "";
        estilos += "#VentanaUrls { position: absolute; left: 10px; top: 10px; width: 300px; border: 1px solid #aaa; font-size: 10px; }";
        estilos += "#VentanaUrls_Titulo { background:#ddd; padding: 2px 5px; cursor: default; border-bottom: 1px solid #aaa; transition: background 0.4s; }";
        estilos += "#VentanaUrls_Lista { background: #eee; display:none; padding: 2px 5px; }";
        estilos += "#VentanaUrls_Lista > ul { margin: 0; }";
        estilos += "#VentanaUrls_Lista > ul > li { margin-bottom: 3px; margin-top: 3px; }";
        estilos += "#VentanaUrls:hover > #VentanaUrls_Lista { display: block !important; }";
        estilos += "#VentanaUrls .btn-verde { background: #198754; color: #fff; text-decoration: none; padding: 1px 5px 2px 5px; border-radius: 5px; }"
        estilos += "#VentanaUrls .btn-verde:hover { background: #157347; }"
        estilos += "#VentanaUrls .btn-amarillo { background: #ffc107; color: #fff; text-decoration: none; padding: 1px 5px 2px 5px; border-radius: 5px; }"
        estilos += "#VentanaUrls .btn-amarillo:hover { background: #ffca2c; }"
        estilos += "#VentanaUrls .btn-rojo { background: #dc3545; color: #fff; text-decoration: none; padding: 1px 5px 2px 5px; border-radius: 5px; }"
        estilos += "#VentanaUrls .btn-rojo:hover { background: #bb2d3b; }"
        style.innerText = estilos;

        // Metemos en el body ambas cosas
        document.body.appendChild(div);
        document.body.appendChild(style);

        // Cogemos referencias a cosas
        me = document.getElementById("VentanaUrls");
        divTitulo = document.getElementById("VentanaUrls_Titulo");
        ulLista = document.getElementById("VentanaUrls_Lista_Ul");
        spanNumero = document.getElementById("VentanaUrls_Titulo_Numero");
        
        // Asignamos eventos
        document.getElementById("VentanaUrls_Titulo_btnAgregar").addEventListener("click", VentanaUrls_Titulo_btnAgregar__click);
        document.getElementById("VentanaUrls_Titulo_btnCopiar").addEventListener("click", VentanaUrls_Titulo_btnCopiar__click);
        document.getElementById("VentanaUrls_Titulo_btnBorrar").addEventListener("click", VentanaUrls_Titulo_btnBorrar__click);
        document.getElementById("VentanaUrls_Lista_Ul").addEventListener("click", VentanaUrls_Lista_Ul__click);
        
    };

    
    function VentanaUrls__rellenar() {

        // Borramos la lista actual
        ulLista.innerHTML = dat.datos.map(url => {
            return `<li><a href="javascript:void(0)" data-accion="eliminar" data-id="${url.Id}" class="btn-rojo">X</a> ${url.Direccion}</li>`;
        }).join("");

        // Ponemos el número de URLs
        spanNumero.innerText = `(${dat.datos.length} URLs)`;
        
    };

    
    function VentanaUrls__eliminar() {
        
        // Vemos si ya está creado y si es así lo destruimos
        let existeVentanaUrls = document.getElementById("VentanaUrls");
        if(existeVentanaUrls) existeVentanaUrls.remove();
        let existeVentanaUrlStyles = document.getElementById("VentanaUrls_style");
        if(existeVentanaUrlStyles) existeVentanaUrlStyles.remove();
       
    };


    
    function VentanaUrls_Titulo_btnAgregar__click(e) {
        
        dat.set({ Id:0, Direccion: window.location.href });
        VentanaUrls__rellenar();
        dat.save();
        efectoCambio();
        
    };

    
    function VentanaUrls_Titulo_btnCopiar__click(e) {
        
        navigator.clipboard.writeText(dat.datos.map(o => o.Direccion).join(";"));
        alert("Datos copiados al Portapapeles");
        
    };

    
    function VentanaUrls_Titulo_btnBorrar__click(e) {
        
        dat.drop();
        VentanaUrls__rellenar();
        efectoCambio();
        
    };

    
    function VentanaUrls_Lista_Ul__click(e) {
        
        if(e.target.dataset.accion=="eliminar") {
            dat.del(e.target.dataset.id);
            VentanaUrls__rellenar();
            dat.save();
            efectoCambio();
        };
        
    };


    
    function efectoCambio() {
        
        divTitulo.style.background = "#fff";
        window.setTimeout(()=>{ divTitulo.style.background = "#ddd"; }, 1000);
        
    };

    function hacerMovible(div) {
        
        div.posX = 0;
        div.posY = 0;
        
        div.addEventListener('mousedown', (e) => {
            
            e.preventDefault();

            posX = e.clientX - div.offsetLeft;
            posY = e.clientY - div.offsetTop;
            
            let div__mousemove = (ee) => {
                div.style.left = `${ee.clientX - posX}px`;
                div.style.top = `${ee.clientY - posY}px`;
            };
            
            let div__mouseup = (ee) => {
                document.removeEventListener('mousemove', div__mousemove);
                document.removeEventListener('mouseup', div__mouseup);
            }
            
            document.addEventListener('mousemove', div__mousemove);
            document.addEventListener('mouseup', div__mouseup);
            
        });   
        
    };


    
    (function run() {
        dat.load();
        VentanaUrls__eliminar();
        VentanaUrls__crear();
        VentanaUrls__rellenar();
        hacerMovible(me);        
    })();


})();

