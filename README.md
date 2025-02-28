# HTTP - Negociación de Contenido, Caching, Etag :books:
Aplicar los conceptos de negociación de contenido, Etag y control de caché en un servicio RESTful utilizando Node.js y Express.

## Endpoint de Negociación de Contenido **/info**
Dependiendo del tipo de petición que se realice (contenida en el accept del header), el servidor responderá con un tipo de contenido diferente. En este caso las opciones de respuesta son: json, xml y html.
Para ello, nos servimos de un método de apoyo que se encarga de verificar si el accept del header contiene alguno de los formatos anteriormente mencionados. 

Para probar que el endpoint funciona correctamente, dentro de Postman podemos hacer lo siguiente. 

![alt text](images/image.png)

Colocar el URL con el formato http://direccion:puerto/info. Además, tendremos que modificar el header de postman, para que el accept lleve el tipo de petición que se está realizando.

![alt text](images/image02.png)
![alt text](images/image03.png)
![alt text](images/image04.png)
Como vemos, la respuesta la da en el formato solicitado.

## Endpoint de preferencia **/preferencia**

En este caso, el servidor responderá con el formato que tenga mayor prioridad en el accept del header. En caso de que no se encuentre ninguno de los formatos soportados, se responderá con un error 406.
Para probar que el endpoint funciona correctamente, dentro de Postman podemos hacer lo siguiente.

![alt text](images/image05.png)

Dentro del valor del accept en el header, agregaremos los niveles de preferencia (q) a cada uno de los formatos, de modo que el de mayor valor sea el que se responda. Por ejemplo, en la imagen de arriba podemos observar que la respuesta se hizo en JSON. Sin embargo, en la siguiente imagen veremos que se hizo en XML. 
----
Alumno: Tony Villegas Hurtado 
EE: DESARROLLO DE SISTEMAS EN RED