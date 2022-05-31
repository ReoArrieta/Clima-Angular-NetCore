Create DataBase Clima
go

use Clima
go

create table Usuarios
(
id int identity (1,1) not null,
nombre varchar(max) not null,
apellido varchar(max) not null,
correo varchar(max) not null,
contraseña varchar(max) not null,
fechaCreacion datetime not null,
--Establecemos la llave primaria--
constraint PK_Usuarios primary key (id)
)
go

create table DatosClima
(
id int identity (1,1) not null,
descripcion varchar(max) not null,
usuarioCreador varchar(max) not null,
fechaCreacion datetime not null,
usuarioModicador varchar(max) null,
fechaModicador datetime null,
--Establecemos la llave primaria--
constraint PK_DatosClima primary key (id)
)
go