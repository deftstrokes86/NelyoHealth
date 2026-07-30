export function createPatientApiClient(config) {
    const doFetch = config.fetchImpl ?? fetch;
    const base = config.baseUrl.replace(/\/$/, "");
    async function call(path, init) {
        const headers = { "x-nelyo-session": config.sessionToken };
        if (init?.body !== undefined)
            headers["content-type"] = "application/json";
        const response = await doFetch(`${base}${path}`, {
            method: init?.method ?? "GET",
            headers,
            body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
            cache: "no-store"
        });
        const envelope = (await response
            .json()
            .catch(() => ({ data: null, errors: [] })));
        return { status: response.status, data: envelope.data, errors: envelope.errors ?? [] };
    }
    function query(params) {
        const search = new URLSearchParams();
        if (params?.limit !== undefined)
            search.set("limit", String(params.limit));
        if (params?.cursor)
            search.set("cursor", params.cursor);
        const qs = search.toString();
        return qs ? `?${qs}` : "";
    }
    return {
        getSessionContext: () => call("/api/session/context"),
        getMyTimeline: (params) => call(`/api/me/timeline${query(params)}`),
        getNotifications: () => call("/api/notifications"),
        markNotificationRead: (notificationId) => call(`/api/notifications/${encodeURIComponent(notificationId)}/read`, { method: "POST", body: {} }),
        getMyAppointments: (params) => call(`/api/me/appointments${query(params)}`),
        getAppointment: (appointmentId) => call(`/api/appointments/${encodeURIComponent(appointmentId)}`),
        cancelAppointment: (appointmentId, body) => call(`/api/appointments/${encodeURIComponent(appointmentId)}/cancel`, { method: "POST", body: body ?? {} })
    };
}
//# sourceMappingURL=patient-client.js.map