using backend_grade_pro.src.Data;
using backend_grade_pro.src.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_grade_pro.src.controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolePermissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RolePermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolePermission>>> GetRolePermissions()
        {
            return await _context.RolePermissions
                .Include(rp => rp.Role)
                .Include(rp => rp.Permission)
                .ToListAsync();
        }

        [HttpGet("{roleId}/{permissionId}")]
        public async Task<ActionResult<RolePermission>> GetRolePermission(int roleId, int permissionId)
        {
            var rolePermission = await _context.RolePermissions
                .Include(rp => rp.Role)
                .Include(rp => rp.Permission)
                .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

            if (rolePermission == null)
            {
                return NotFound();
            }

            return rolePermission;
        }

        [HttpPost]
        public async Task<ActionResult<RolePermission>> PostRolePermission(RolePermission rolePermission)
        {
            _context.RolePermissions.Add(rolePermission);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRolePermission", new { roleId = rolePermission.RoleId, permissionId = rolePermission.PermissionId }, rolePermission);
        }

        [HttpPut("Inactivate/{roleId}/{permissionId}")]
        public async Task<IActionResult> InactivateRolePermission(int roleId, int permissionId)
        {
            var rolePermission = await _context.RolePermissions
                .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

            if (rolePermission == null)
            {
                return NotFound();
            }

            rolePermission.State = false;
            _context.Entry(rolePermission).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("SeedData")]
        public async Task<IActionResult> SeedData()
        {
            if (!_context.Roles.Any() && !_context.Permissions.Any())
            {
                var roles = new List<Role>
                {
                    new Role { Name = "Representante", State = true },
                    new Role { Name = "Profesor", State = true },
                    new Role { Name = "Estudiante", State = true },
                    new Role { Name = "SuperAdministrador", State = true }
                };

                var permissions = new List<Permission>
                {
                    new Permission { Name = "Puede ver notas", State = true },
                    new Permission { Name = "Puede editar notas", State = true },
                    new Permission { Name = "Puede agregar notas", State = true },
                    new Permission { Name = "Administración total de calificaciones", State = true },
                    new Permission { Name = "Crear preguntas", State = true },
                    new Permission { Name = "Acceso a notas", State = true }
                };

                await _context.Roles.AddRangeAsync(roles);
                await _context.Permissions.AddRangeAsync(permissions);
                await _context.SaveChangesAsync();

                var rolePermissions = new List<RolePermission>
                {
                    new RolePermission { RoleId = roles.First(r => r.Name == "Representante").Id, PermissionId = permissions.First(p => p.Name == "Puede ver notas").Id, State = true },
                    new RolePermission { RoleId = roles.First(r => r.Name == "Profesor").Id, PermissionId = permissions.First(p => p.Name == "Puede ver notas").Id, State = true },
                    new RolePermission { RoleId = roles.First(r => r.Name == "Profesor").Id, PermissionId = permissions.First(p => p.Name == "Puede editar notas").Id, State = true },
                    new RolePermission { RoleId = roles.First(r => r.Name == "Profesor").Id, PermissionId = permissions.First(p => p.Name == "Puede agregar notas").Id, State = true },
                    new RolePermission { RoleId = roles.First(r => r.Name == "SuperAdministrador").Id, PermissionId = permissions.First(p => p.Name == "Administración total de calificaciones").Id, State = true },
                    new RolePermission { RoleId = roles.First(r => r.Name == "SuperAdministrador").Id, PermissionId = permissions.First(p => p.Name == "Crear preguntas").Id, State = true },
                    new RolePermission { RoleId = roles.First(r => r.Name == "SuperAdministrador").Id, PermissionId = permissions.First(p => p.Name == "Acceso a notas").Id, State = true }
                };

                await _context.RolePermissions.AddRangeAsync(rolePermissions);
                await _context.SaveChangesAsync();

                return Ok("Datos iniciales insertados correctamente.");
            }

            return BadRequest("Los datos iniciales ya existen.");
        }
    }
}
