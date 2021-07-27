# SWTrabajaPeru-G7
Proyecto de curso Métodos Formales para Pruebas

## Requisitos para poder usar la app

1. Instalar **Node.js**, ver [aqui](https://nodejs.org/es/download/package-manager/).
2. Necesitamos la herramnienta **npm** que viene junto con Node.js. Para ver si estan ambos instalados 
correctamente, correr en una terminal `node -v` y `npm -v`, respectivamente.
3. Debemos instalar **mysql**, ver [aqui](https://dev.mysql.com/doc/refman/8.0/en/installing.html).
4. Situados en la carpeta _'sw-TrabajaPeru-G7'_ del código fuente, correr desde una terminal `npm install` para instalar 
las dependencias que necesita el backend para funcionar correctamente.
5. Situados en la carpeta _'SWTrabajaPeru-G7/client'_ del código fuente, correr desde una terminal `npm install` que necesita 
el frontend para funcionar correctamente.

## Cómo usar la app


2. Situados en la carpeta _'ws-TrabajaPeru-G7'_, correr desde una terminal `npm run dev` para levantar un 
servidor web en el puerto 4000 y poder usar la API del backend, hecha con node.
3. Situados en la carpeta _'SWTrabajaPeru-G7'_, correr desde una terminal `npm start` para levantar un 
servidor web en el puerto 3000 y poder usar la aplicacion del fronted, hecha con React. :smile:

## Documentación

### Fundamentación de frameworks elegidos

Para llevar a cabo la realización del producto de software planteado por la cátedra, optamos por separar 
totalmente el frontend del backend. Ésto fue todo un desafío para el grupo ya que no estábamos acostumbrados a 
desarrollar de ésta manera, pero luego de realizar un poco de investigación a la hora de elegir el enfoque a 
seguir, notamos las numerosas ventajas que tiene considerar el frontend y el backend como proyectos 
independientes (pero relacionados, por su puesto). Pensamos a la aplicación web planteada como un 'conjunto de 
pantallas' que consumen servicios, los cuales podrian ser reutilizados por 'otras pantallas', de otras futuras 
aplicaciones. Para explicar mejor lo anterior, planteamos el siguiente ejemplo: ¿Qué pasaría si en un futuro 
se quisiera hacer un aplicación del hospital para celulares? (¿Por qué no?). Teniendo los servicios donde se 
ejecuta la logica y se accede a los datos desacoplados totalmente de las interfaces de usuario, no tendriamos 
ningun tipo de problema en comunicarnos con ese backend previamente realizado y así reutilizar lo servicios 
desarrollados, con un frontend totalmente distinto al de la aplicación web original. 

Ahora bien, hablando en concreto de las herramientas utilizadas para el desarrollo, para el backend elegimos 
el framework **node**, y para el frontend usamos la libreria de Javascript **React**, junto con la librería 
**Material UI**. Procederemos a fundamentar la elección de las herramientas mencionadas.


**¿Por qué Node?**
Node.js es un entorno en tiempo de ejecución multiplataforma, de código abierto, para la capa del servidor 
(pero no limitándose a ello) basado en el lenguaje de programación JavaScript, asíncrono, con E/S de datos en 
una arquitectura orientada a eventos y basado en el motor V8 de Google. Fue creado con el enfoque de ser útil 
en la creación de programas de red altamente escalables, como por ejemplo, servidores web.4​ Fue creado por 
Ryan Dahl en 2009 y su evolución está apadrinada por la empresa Joyent, que además tiene contratado a Dahl en 
plantilla

**¿Por qué React?**
React es una librería Javascript que proviene de Facebook, focalizada en el desarrollo de interfaces de 
usuario. Sirve para desarrollar aplicaciones web de una manera más ordenada, ágil, flexible y con menos código 
que si usas Javascript puro o librerías como jQuery centradas en la manipulación del DOM. Permite que las 
vistas se asocien con los datos, de tal forma que si cambian los datos, también cambian las vistas. Así, no 
necesitamos escribir código para manipular la página cuando los datos cambian. React le pone más 
'inteligencia' a la necesidad de actualizar una vista solo cuando es necesario, y lo consigue mediante el "DOM 
Virtual", que es mucho más rápido que actualizar el DOM del navegador. Ésta característica fue la que nos hizo 
poner el foco en React cuando estábamos buscando con qué herramienta desarrollar el frontend:  React compara 
el DOM Virtual con el DOM del navegador y sabe perfectamente qué partes de la página debe actualizar, 
ahorrando así la necesidad de actualizar la vista entera. Es algo muy potente y permite obtener un rendimiento 
totalmente optimizado. Lo que nos pareció interesante es que ésto se hace de manera transparente para el 
desarrollador; no se requiere intervenir en nada para lograr una gran performance.

Por otro lado, usamos la librería Material UI para mejorar la vista de las pantallas, ya que provee 
componentes de React que implementan los principios de diseño planteados por Google, los cuales nos parecen 
muy interesantes y sentimos le dan un aspecto muy profesional a las aplicaciones.

### Referencias

**React**
* [Tutorial completo](https://reactjs.org/tutorial/tutorial.html)

**Material UI**
* [Bases](https://material-ui-next.com/getting-started/installation/)
* [Entendiendo Material UI, tutorial completo](https://www.youtube.com/watch?v=xm4LX5fJKZ8&list=PLcCp4mjO-z98WAu4sd0eVha1g-NMfzHZk)
* [Extendiendo tablas en Material UI](https://www.youtube.com/watch?v=SX_IL7LqSxM)

**Chart.js**
* [Usando Chart.js con React](https://www.youtube.com/watch?v=Ly-9VTXJlnA&t=295s)

### Modulos aprovechados

### Mecanismo provisto para el manejo de seguridad y routing

En cuanto al manejo de seguridad, node permite el control de acceso a datos mediante la definición de 
restricciones en los modelos. Así, se puede especificar quien puede leer/escribir datos o ejecutar metodos en 
los modelos. El control de acceso está determinado por _ACLs_ (Access Control Lists), a través de un archivo '.
json' que está relacionado con el modelo que restringe. 
Relacionada a la seguridad, se encuentra la Autentificación. JWT viene con un sistema que protege el acceso a 
datos basado en tokens. Cuando un usuario se autentifica, recibe el token que debe utilizar en las siguientes 
peticiones, el cual tiene un ttl.

Por otra parte, manejamos ruteo (más específicamente 'rueteo dinámico') en el frontend usando la libreria para 
React _react-router-dom_, para poder navegar a través de los distintos contenidos de la aplicación. Decimos 
'ruteo dinámico' porque el ruteo se va realizando a medida que que la app se renderiza (no en una 
configuración fuera de la app que se encuentra corriendo, como parte de una 'inicialización' antes de que 
empiece a correr, lo que es más común ver).

### Mecanismo provisto para operaciones CRUD

Como detallamos previamente, express nos provee de base las operaciones CRUD cuando generamos un modelo, y 
además nos expone los REST endpoints de la API del backend en el _routes_ integrado para poder ver bien qué 
requerimiento http debemos mandar, a qué ruta y con qué parámetros, lo que es de gran ayuda a la hora de hacer 
los CRUDs.

### Forma de manejar el MVC

Considerando el backend y el fronted como proyectos diferentes, hablaremos de la manera de manejar MVC en cada 
uno de ellos. 

Por un lado, en lo que respecta al backend, la aplicación que provee servicios, el acceso a datos está dado 
por las funciones propias de node, que se generan automaticamente cuando creamos un modelo de datos (M). La 
lógica de la aplicación (C), se ve en las funciones también propias de loopback que se ejecutan como acción 
ante cada requerimiento http realizado por el cliente, el fronted, acorde a los endpoints disponibles. Luego, 
toda función ejecutada ante una solicitud del cliente devuelve información en formato JSON, lo cual puede ser 
considerado como parte de la vista (V).

Por otro lado, en el frontend, la aplicación que genera las distintas pantallas, podemos considerar la 
renderización de los componentes de React como la vista (V), la manipulación del estado de los mismos como 
parte del modelo (M), y los distintos metodos que poseen los componentes como parte del controlador (C).
