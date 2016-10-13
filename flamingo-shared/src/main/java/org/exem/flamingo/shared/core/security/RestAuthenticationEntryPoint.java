/*
 * Copyright (C) 2011 Flamingo Project (https://github.com/OpenCloudEngine/flamingo2).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.exem.flamingo.shared.core.security;

import org.exem.flamingo.shared.core.rest.Response;
import org.exem.flamingo.shared.util.ExceptionUtils;
import org.exem.flamingo.shared.util.JsonUtils;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author Byoung Gon, Kim
 * @version 2.0
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException e) throws IOException, ServletException {
        if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
            // 에러를 발송할 Response를 구성한다.
            Response errorResponse = new Response();
            errorResponse.setSuccess(false);
            errorResponse.getError().setMessage("You do not have permission to perform the requested action.");
            if (e.getCause() != null) errorResponse.getError().setCause(e.getCause().getMessage());
            errorResponse.getError().setException(ExceptionUtils.getFullStackTrace(e));
            errorResponse.getError().setCode(String.valueOf(HttpServletResponse.SC_UNAUTHORIZED));

            // Response HTTP Header를 설정한다.
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("code", "404");

            // JSON을 생성하여 HTTP Response로 응답한다.
            PrintWriter out = response.getWriter();
            out.print(JsonUtils.marshal(errorResponse));
        } else {
            response.setHeader("code", "404");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        }
    }

}