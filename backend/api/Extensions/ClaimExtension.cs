using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api.Extensions
{
    public static class ClaimExtension
    {
        public static string? GetUsername(this ClaimsPrincipal? user)
        {
            return user?.FindFirst(ClaimTypes.GivenName)?.Value
            ?? user?.FindFirst(ClaimTypes.Name)?.Value
            ?? user?.FindFirst("username")?.Value;
        }
    }
}