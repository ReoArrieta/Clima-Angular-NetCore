using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ClimaApp.Models
{
    public partial class ClimaCTX : DbContext
    {
        public ClimaCTX()
        {
        }

        public ClimaCTX(DbContextOptions<ClimaCTX> options)
            : base(options)
        {
        }

        public virtual DbSet<DatosClima> DatosClimas { get; set; } = null!;
        public virtual DbSet<Usuario> Usuarios { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=localhost;Database=Clima;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DatosClima>(entity =>
            {
                entity.ToTable("DatosClima");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Descripcion)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaCreacion");

                entity.Property(e => e.FechaModicador)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaModicador");

                entity.Property(e => e.UsuarioCreador)
                    .IsUnicode(false)
                    .HasColumnName("usuarioCreador");

                entity.Property(e => e.UsuarioModicador)
                    .IsUnicode(false)
                    .HasColumnName("usuarioModicador");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Apellido)
                    .IsUnicode(false)
                    .HasColumnName("apellido");

                entity.Property(e => e.Contraseña)
                    .IsUnicode(false)
                    .HasColumnName("contraseña");

                entity.Property(e => e.Correo)
                    .IsUnicode(false)
                    .HasColumnName("correo");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaCreacion");

                entity.Property(e => e.Nombre)
                    .IsUnicode(false)
                    .HasColumnName("nombre");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
