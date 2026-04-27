import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProperties: 0,
    totalClients: 0,
    leadStatuses: {
      NEW: 0,
      CONTACTED: 0,
      VISIT_SCHEDULED: 0,
      NEGOTIATION: 0,
      CONVERTED: 0,
      CLOSED: 0,
    },
    propertyStatuses: {},
  });

  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [leadsRes, propsRes, clientsRes] = await Promise.all([
          axios
            .get("http://localhost:5000/api/v1/leads", config)
            .catch((e) => ({ data: { data: [] } })),
          axios
            .get("http://localhost:5000/api/v1/properties", config)
            .catch((e) => ({ data: { data: [] } })),
          axios
            .get("http://localhost:5000/api/v1/clients", config)
            .catch((e) => ({ data: { data: [] } })),
        ]);

        const leads = leadsRes.data?.data || [];
        const properties = propsRes.data?.data || [];
        const clients = clientsRes.data?.data || [];

        const leadStatusesCounts = leads.reduce(
          (acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
          },
          {
            NEW: 0,
            CONTACTED: 0,
            VISIT_SCHEDULED: 0,
            NEGOTIATION: 0,
            CONVERTED: 0,
            CLOSED: 0,
          }
        );

        setStats({
          totalLeads: leads.length,
          totalProperties: properties.length,
          totalClients: clients.length,
          leadStatuses: leadStatusesCounts,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const leadChartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
    },
    labels: Object.keys(stats.leadStatuses).map((l) => l.replace("_", " ")),
    colors: ["#4F46E5", "#60A5FA", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total Leads",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
    },
  };

  const leadChartSeries = Object.values(stats.leadStatuses);

  // Dummy data for a timeline/bar chart making it look rich
  const revenueOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#4F46E5", "#10B981"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    legend: { position: "top", horizontalAlign: "right" },
  };

  const revenueSeries = [
    { name: "Deals Closed", data: [31, 40, 28, 51, 42, 109, 100] },
    { name: "New Inquiries", data: [11, 32, 45, 32, 34, 52, 41] },
  ];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Analytics Dashboard</h2>
          <p className="text-muted mb-0">
            Overview of your business performance.
          </p>
        </div>
      </div>

      {/* Top Stats Cards */}
      {/* <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card premium-card border-0">
            <div className="card-body">
              <div className="stat-label">Total Leads</div>
              <div className="stat-value">{stats.totalLeads}</div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-md-6">
          <div className="card premium-card border-0">
            <div className="card-body">
              <div className="d-flex">
                <div className="flex-grow-1">
                  <div className="d-flex flex-column h-100">
                    <p className="fs-md- text-muted mb-4">Properties for sale</p>
                    <h3 className="mb-0 mt-auto fs-md">
                      <span>
                        <span>3,652</span>{" "}
                      </span>
                      <small className="text-success mb-0 fs-sm-xs">
                        <i className="bi bi-arrow-up me-1"></i> 06.19%
                      </small>
                    </h3>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div
                    options="[object Object]"
                    series="80"
                    height="110"
                    width="110"
                    type="radialBar"
                    style={{ minHeight: "80px" }}
                  >
                    <div
                      id="apexcharts4mg3106e"
                      className="apexcharts-canvas apexcharts4mg3106e apexcharts-theme-"
                      style={{ width: "110px", height: "111px" }}
                    >
                      <svg
                        id="SvgjsSvg7054"
                        width="110"
                        height="111"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xmlns:svgjs="http://svgjs.dev"
                        className="apexcharts-svg"
                        xmlns:data="ApexChartsNS"
                        transform="translate(0, 0)"
                      >
                        <foreignObject x="0" y="0" width="110" height="111">
                          <div
                            xmlns="http://www.w3.org/1999/xhtml"
                            style={{
                              position: "relative",
                              height: "100%",
                              width: "100%",
                            }}
                          >
                            <div className="apexcharts-legend"></div>
                          </div>
                        </foreignObject>
                        <g
                          id="SvgjsG7056"
                          className="apexcharts-inner apexcharts-graphical"
                          transform="translate(0, 1)"
                        >
                          <defs id="SvgjsDefs7055">
                            <clipPath id="gridRectMask4mg3106e">
                              <rect
                                id="SvgjsRect7057"
                                width="110"
                                height="108"
                                x="0"
                                y="0"
                                rx="0"
                                ry="0"
                                opacity="1"
                                stroke-width="0"
                                stroke="none"
                                stroke-dasharray="0"
                                fill="#fff"
                              ></rect>
                            </clipPath>
                            <clipPath id="gridRectBarMask4mg3106e">
                              <rect
                                id="SvgjsRect7058"
                                width="116"
                                height="114"
                                x="-3"
                                y="-3"
                                rx="0"
                                ry="0"
                                opacity="1"
                                stroke-width="0"
                                stroke="none"
                                stroke-dasharray="0"
                                fill="#fff"
                              ></rect>
                            </clipPath>
                            <clipPath id="gridRectMarkerMask4mg3106e">
                              <rect
                                id="SvgjsRect7059"
                                width="110"
                                height="108"
                                x="0"
                                y="0"
                                rx="0"
                                ry="0"
                                opacity="1"
                                stroke-width="0"
                                stroke="none"
                                stroke-dasharray="0"
                                fill="#fff"
                              ></rect>
                            </clipPath>
                            <clipPath id="forecastMask4mg3106e"></clipPath>
                            <clipPath id="nonForecastMask4mg3106e"></clipPath>
                          </defs>
                          <g id="SvgjsG7062" className="apexcharts-radialbar">
                            <g id="SvgjsG7063">
                              <g id="SvgjsG7064" className="apexcharts-tracks">
                                <g
                                  id="SvgjsG7065"
                                  className="apexcharts-radialbar-track apexcharts-track"
                                  rel="1"
                                >
                                  <path
                                    id="apexcharts-radialbarTrack-0"
                                    d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                    fill="none"
                                    fill-opacity="1"
                                    stroke="rgba(122,193,155,0.85)"
                                    stroke-opacity="0.2"
                                    stroke-linecap="round"
                                    stroke-width="12.775609756097563"
                                    stroke-dasharray="0"
                                    className="apexcharts-radialbar-area"
                                    data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                  ></path>
                                </g>
                              </g>
                              <g id="SvgjsG7067">
                                <g
                                  id="SvgjsG7069"
                                  className="apexcharts-series apexcharts-radial-series"
                                  seriesName="Cricket"
                                  rel="1"
                                  data:realIndex="0"
                                >
                                  <path
                                    id="SvgjsPath7070"
                                    d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 23.68472446345226 43.82505018521513 "
                                    fill="none"
                                    fill-opacity="0.85"
                                    stroke="rgba(122,193,155,0.85)"
                                    stroke-opacity="1"
                                    stroke-linecap="round"
                                    stroke-width="13.170731707317074"
                                    stroke-dasharray="0"
                                    className="apexcharts-radialbar-area apexcharts-radialbar-slice-0"
                                    data:angle="288"
                                    data:value="80"
                                    index="0"
                                    j="0"
                                    data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 23.68472446345226 43.82505018521513 "
                                  ></path>
                                </g>
                                <circle
                                  id="SvgjsCircle7068"
                                  r="26.539024390243902"
                                  cx="55"
                                  cy="54"
                                  className="apexcharts-radialbar-hollow"
                                  fill="transparent"
                                ></circle>
                              </g>
                            </g>
                          </g>
                          <line
                            id="SvgjsLine7071"
                            x1="0"
                            y1="0"
                            x2="110"
                            y2="0"
                            stroke="#b6b6b6"
                            stroke-dasharray="0"
                            stroke-width="1"
                            stroke-linecap="butt"
                            className="apexcharts-ycrosshairs"
                          ></line>
                          <line
                            id="SvgjsLine7072"
                            x1="0"
                            y1="0"
                            x2="110"
                            y2="0"
                            stroke-dasharray="0"
                            stroke-width="0"
                            stroke-linecap="butt"
                            className="apexcharts-ycrosshairs-hidden"
                          ></line>
                        </g>
                        <g
                          id="SvgjsG7060"
                          className="apexcharts-datalabels-group"
                          transform="translate(0, 0) scale(1)"
                        ></g>
                        <g
                          id="SvgjsG7061"
                          className="apexcharts-datalabels-group"
                          transform="translate(0, 0) scale(1)"
                        ></g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card premium-card border-0">
            <div className="card-body">
              <div className="stat-icon success">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="stat-value">{stats.totalClients}</div>
              <div className="stat-label">Total Clients</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card premium-card border-0">
            <div className="card-body">
              <div className="stat-icon warning">
                <i className="bi bi-building-fill"></i>
              </div>
              <div className="stat-value">{stats.totalProperties}</div>
              <div className="stat-label">Listed Properties</div>
            </div>
          </div>
        </div>
      </div> */}
       <div className="container-fluid mt-4">
        <div className="row g-4">
          <div className="col-xxl-3 col-md-6">
            <div className="card premium-card border-0">
              <div className="card-body">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <div className="d-flex flex-column h-100">
                      <p className="fs-md- text-muted mb-4">
                        Properties for sale
                      </p>
                      <h3 className="mb-0 mt-auto fs-md">
                        <span>
                          <span>3,652</span>{" "}
                        </span>
                        <small className="text-success mb-0 fs-sm-xs">
                          <i className="bi bi-arrow-up me-1"></i> 06.19%
                        </small>
                      </h3>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      options="[object Object]"
                      series="80"
                      height="110"
                      width="110"
                      type="radialBar"
                      style={{ minHeight: "80px" }}
                    >
                      <div
                        id="apexcharts4mg3106e"
                        className="apexcharts-canvas apexcharts4mg3106e apexcharts-theme-"
                        style={{ width: "110px", height: "111px" }}
                      >
                        <svg
                          id="SvgjsSvg7054"
                          width="110"
                          height="111"
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          xmlns:svgjs="http://svgjs.dev"
                          className="apexcharts-svg"
                          xmlns:data="ApexChartsNS"
                          transform="translate(0, 0)"
                        >
                          <foreignObject x="0" y="0" width="110" height="111">
                            <div
                              xmlns="http://www.w3.org/1999/xhtml"
                              style={{
                                position: "relative",
                                height: "100%",
                                width: "100%",
                              }}
                            >
                              <div className="apexcharts-legend"></div>
                            </div>
                          </foreignObject>
                          <g
                            id="SvgjsG7056"
                            className="apexcharts-inner apexcharts-graphical"
                            transform="translate(0, 1)"
                          >
                            <defs id="SvgjsDefs7055">
                              <clipPath id="gridRectMask4mg3106e">
                                <rect
                                  id="SvgjsRect7057"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectBarMask4mg3106e">
                                <rect
                                  id="SvgjsRect7058"
                                  width="116"
                                  height="114"
                                  x="-3"
                                  y="-3"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectMarkerMask4mg3106e">
                                <rect
                                  id="SvgjsRect7059"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="forecastMask4mg3106e"></clipPath>
                              <clipPath id="nonForecastMask4mg3106e"></clipPath>
                            </defs>
                            <g id="SvgjsG7062" className="apexcharts-radialbar">
                              <g id="SvgjsG7063">
                                <g
                                  id="SvgjsG7064"
                                  className="apexcharts-tracks"
                                >
                                  <g
                                    id="SvgjsG7065"
                                    className="apexcharts-radialbar-track apexcharts-track"
                                    rel="1"
                                  >
                                    <path
                                      id="apexcharts-radialbarTrack-0"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                      fill="none"
                                      fill-opacity="1"
                                      stroke="rgba(122,193,155,0.85)"
                                      stroke-opacity="0.2"
                                      stroke-linecap="round"
                                      stroke-width="12.775609756097563"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                    ></path>
                                  </g>
                                </g>
                                <g id="SvgjsG7067">
                                  <g
                                    id="SvgjsG7069"
                                    className="apexcharts-series apexcharts-radial-series"
                                    seriesName="Cricket"
                                    rel="1"
                                    data:realIndex="0"
                                  >
                                    <path
                                      id="SvgjsPath7070"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 23.68472446345226 43.82505018521513 "
                                      fill="none"
                                      fill-opacity="0.85"
                                      stroke="rgba(122,193,155,0.85)"
                                      stroke-opacity="1"
                                      stroke-linecap="round"
                                      stroke-width="13.170731707317074"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area apexcharts-radialbar-slice-0"
                                      data:angle="288"
                                      data:value="80"
                                      index="0"
                                      j="0"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 23.68472446345226 43.82505018521513 "
                                    ></path>
                                  </g>
                                  <circle
                                    id="SvgjsCircle7068"
                                    r="26.539024390243902"
                                    cx="55"
                                    cy="54"
                                    className="apexcharts-radialbar-hollow"
                                    fill="transparent"
                                  ></circle>
                                </g>
                              </g>
                            </g>
                            <line
                              id="SvgjsLine7071"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke="#b6b6b6"
                              stroke-dasharray="0"
                              stroke-width="1"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs"
                            ></line>
                            <line
                              id="SvgjsLine7072"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke-dasharray="0"
                              stroke-width="0"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs-hidden"
                            ></line>
                          </g>
                          <g
                            id="SvgjsG7060"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                            style={{ opacity: 1 }}
                          ></g>
                          <g
                            id="SvgjsG7061"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                          ></g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-md-6">
            <div className="card premium-card border-0">
              <div className="card-body">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <div className="d-flex flex-column h-100">
                      <p className="fs-md- text-muted mb-4">
                        Properties for rent
                      </p>
                      <h3 className="mb-0 mt-auto fs-md">
                        <span>
                          <span>1,524</span>{" "}
                        </span>
                        <small className="text-success mb-0 fs-sm-xs">
                          <i className="bi bi-arrow-up me-1"></i> 02.33%
                        </small>
                      </h3>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      options="[object Object]"
                      series="65"
                      height="110"
                      width="110"
                      type="radialBar"
                      style={{ minHeight: "80px" }}
                    >
                      <div
                        id="apexchartsjpw9go2f"
                        className="apexcharts-canvas apexchartsjpw9go2f apexcharts-theme-"
                        style={{ width: "110px", height: "111px" }}
                      >
                        <svg
                          id="SvgjsSvg7073"
                          width="110"
                          height="111"
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          xmlns:svgjs="http://svgjs.dev"
                          className="apexcharts-svg"
                          xmlns:data="ApexChartsNS"
                          transform="translate(0, 0)"
                        >
                          <foreignObject x="0" y="0" width="110" height="111">
                            <div
                              xmlns="http://www.w3.org/1999/xhtml"
                              style={{
                                position: "relative",
                                height: "100%",
                                width: "100%",
                              }}
                            >
                              <div className="apexcharts-legend"></div>
                            </div>
                          </foreignObject>
                          <g
                            id="SvgjsG7075"
                            className="apexcharts-inner apexcharts-graphical"
                            transform="translate(0, 1)"
                          >
                            <defs id="SvgjsDefs7074">
                              <clipPath id="gridRectMaskjpw9go2f">
                                <rect
                                  id="SvgjsRect7076"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectBarMaskjpw9go2f">
                                <rect
                                  id="SvgjsRect7077"
                                  width="116"
                                  height="114"
                                  x="-3"
                                  y="-3"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectMarkerMaskjpw9go2f">
                                <rect
                                  id="SvgjsRect7078"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="forecastMaskjpw9go2f"></clipPath>
                              <clipPath id="nonForecastMaskjpw9go2f"></clipPath>
                            </defs>
                            <g id="SvgjsG7081" className="apexcharts-radialbar">
                              <g id="SvgjsG7082">
                                <g
                                  id="SvgjsG7083"
                                  className="apexcharts-tracks"
                                >
                                  <g
                                    id="SvgjsG7084"
                                    className="apexcharts-radialbar-track apexcharts-track"
                                    rel="1"
                                  >
                                    <path
                                      id="apexcharts-radialbarTrack-0"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                      fill="none"
                                      fill-opacity="1"
                                      stroke="rgba(249,184,90,0.85)"
                                      stroke-opacity="0.2"
                                      stroke-linecap="round"
                                      stroke-width="12.775609756097563"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                    ></path>
                                  </g>
                                </g>
                                <g id="SvgjsG7086">
                                  <g
                                    id="SvgjsG7088"
                                    className="apexcharts-series apexcharts-radial-series"
                                    seriesName="Cricket"
                                    rel="1"
                                    data:realIndex="0"
                                  >
                                    <path
                                      id="SvgjsPath7089"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 28.361635551068805 73.3539046486546 "
                                      fill="none"
                                      fill-opacity="0.85"
                                      stroke="rgba(249,184,90,0.85)"
                                      stroke-opacity="1"
                                      stroke-linecap="round"
                                      stroke-width="13.170731707317074"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area apexcharts-radialbar-slice-0"
                                      data:angle="234"
                                      data:value="65"
                                      index="0"
                                      j="0"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 28.361635551068805 73.3539046486546 "
                                    ></path>
                                  </g>
                                  <circle
                                    id="SvgjsCircle7087"
                                    r="26.539024390243902"
                                    cx="55"
                                    cy="54"
                                    className="apexcharts-radialbar-hollow"
                                    fill="transparent"
                                  ></circle>
                                </g>
                              </g>
                            </g>
                            <line
                              id="SvgjsLine7090"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke="#b6b6b6"
                              stroke-dasharray="0"
                              stroke-width="1"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs"
                            ></line>
                            <line
                              id="SvgjsLine7091"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke-dasharray="0"
                              stroke-width="0"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs-hidden"
                            ></line>
                          </g>
                          <g
                            id="SvgjsG7079"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                          ></g>
                          <g
                            id="SvgjsG7080"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                          ></g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-md-6">
            <div className="card premium-card border-0">
              <div className="card-body">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <div className="d-flex flex-column h-100">
                      <p className="fs-md- text-muted mb-4">Visitors</p>
                      <h3 className="mb-0 mt-auto fs-md">
                        <span>
                          <span>149.36k</span>{" "}
                        </span>
                        <small className="text-success mb-0 fs-sm-xs">
                          <i className="bi bi-arrow-up me-1"></i> 12.33%
                        </small>
                      </h3>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      options="[object Object]"
                      series="47"
                      height="110"
                      width="110"
                      type="radialBar"
                      style={{ minHeight: "80px" }}
                    >
                      <div
                        id="apexchartse2nzrf3pl"
                        className="apexcharts-canvas apexchartse2nzrf3pl apexcharts-theme-"
                        style={{ width: "110px", height: "111px" }}
                      >
                        <svg
                          id="SvgjsSvg7092"
                          width="110"
                          height="111"
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          xmlns:svgjs="http://svgjs.dev"
                          className="apexcharts-svg"
                          xmlns:data="ApexChartsNS"
                          transform="translate(0, 0)"
                        >
                          <foreignObject x="0" y="0" width="110" height="111">
                            <div
                              xmlns="http://www.w3.org/1999/xhtml"
                              style={{
                                position: "relative",
                                height: "100%",
                                width: "100%",
                              }}
                            >
                              <div className="apexcharts-legend"></div>
                            </div>
                          </foreignObject>
                          <g
                            id="SvgjsG7094"
                            className="apexcharts-inner apexcharts-graphical"
                            transform="translate(0, 1)"
                          >
                            <defs id="SvgjsDefs7093">
                              <clipPath id="gridRectMaske2nzrf3pl">
                                <rect
                                  id="SvgjsRect7095"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectBarMaske2nzrf3pl">
                                <rect
                                  id="SvgjsRect7096"
                                  width="116"
                                  height="114"
                                  x="-3"
                                  y="-3"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectMarkerMaske2nzrf3pl">
                                <rect
                                  id="SvgjsRect7097"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="forecastMaske2nzrf3pl"></clipPath>
                              <clipPath id="nonForecastMaske2nzrf3pl"></clipPath>
                            </defs>
                            <g id="SvgjsG7100" className="apexcharts-radialbar">
                              <g id="SvgjsG7101">
                                <g
                                  id="SvgjsG7102"
                                  className="apexcharts-tracks"
                                >
                                  <g
                                    id="SvgjsG7103"
                                    className="apexcharts-radialbar-track apexcharts-track"
                                    rel="1"
                                  >
                                    <path
                                      id="apexcharts-radialbarTrack-0"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                      fill="none"
                                      fill-opacity="1"
                                      stroke="rgba(63,66,94,0.85)"
                                      stroke-opacity="0.2"
                                      stroke-linecap="round"
                                      stroke-width="12.775609756097563"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                    ></path>
                                  </g>
                                </g>
                                <g id="SvgjsG7105">
                                  <g
                                    id="SvgjsG7107"
                                    className="apexcharts-series apexcharts-radial-series"
                                    seriesName="Cricket"
                                    rel="1"
                                    data:realIndex="0"
                                  >
                                    <path
                                      id="SvgjsPath7108"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 0 1 61.28273521361794 86.32187067449625 "
                                      fill="none"
                                      fill-opacity="0.85"
                                      stroke="rgba(63,66,94,0.85)"
                                      stroke-opacity="1"
                                      stroke-linecap="round"
                                      stroke-width="13.170731707317074"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area apexcharts-radialbar-slice-0"
                                      data:angle="169"
                                      data:value="47"
                                      index="0"
                                      j="0"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 0 1 61.28273521361794 86.32187067449625 "
                                    ></path>
                                  </g>
                                  <circle
                                    id="SvgjsCircle7106"
                                    r="26.539024390243902"
                                    cx="55"
                                    cy="54"
                                    className="apexcharts-radialbar-hollow"
                                    fill="transparent"
                                  ></circle>
                                </g>
                              </g>
                            </g>
                            <line
                              id="SvgjsLine7109"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke="#b6b6b6"
                              stroke-dasharray="0"
                              stroke-width="1"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs"
                            ></line>
                            <line
                              id="SvgjsLine7110"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke-dasharray="0"
                              stroke-width="0"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs-hidden"
                            ></line>
                          </g>
                          <g
                            id="SvgjsG7098"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                          ></g>
                          <g
                            id="SvgjsG7099"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                          ></g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-md-6">
            <div className="card premium-card border-0">
              <div className="card-body">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <div className="d-flex flex-column h-100">
                      <p className="fs-md text-muted mb-4">
                        Residency Property
                      </p>
                      <h3 className="mb-0 mt-auto fs-md">
                        <span>
                          <span>2,376</span>{" "}
                        </span>
                        <small className="text-danger mb-0 fs-sm-xs">
                          <i className="bi bi-arrow-down me-1"></i> 09.57%
                        </small>
                      </h3>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      options="[object Object]"
                      series="43"
                      height="110"
                      width="110"
                      type="radialBar"
                      style={{ minHeight: "80px" }}
                    >
                      <div
                        id="apexcharts3s1dtqd2"
                        className="apexcharts-canvas apexcharts3s1dtqd2 apexcharts-theme-"
                        style={{ width: "110px", height: "111px" }}
                      >
                        <svg
                          id="SvgjsSvg7111"
                          width="110"
                          height="111"
                          xmlns="http://www.w3.org/2000/svg"
                          version="1.1"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          xmlns:svgjs="http://svgjs.dev"
                          className="apexcharts-svg"
                          xmlns:data="ApexChartsNS"
                          transform="translate(0, 0)"
                        >
                          <foreignObject x="0" y="0" width="110" height="111">
                            <div
                              xmlns="http://www.w3.org/1999/xhtml"
                              style={{
                                position: "relative",
                                height: "100%",
                                width: "100%",
                              }}
                            >
                              <div className="apexcharts-legend"></div>
                            </div>
                          </foreignObject>
                          <g
                            id="SvgjsG7113"
                            className="apexcharts-inner apexcharts-graphical"
                            transform="translate(0, 1)"
                          >
                            <defs id="SvgjsDefs7112">
                              <clipPath id="gridRectMask3s1dtqd2">
                                <rect
                                  id="SvgjsRect7114"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectBarMask3s1dtqd2">
                                <rect
                                  id="SvgjsRect7115"
                                  width="116"
                                  height="114"
                                  x="-3"
                                  y="-3"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="gridRectMarkerMask3s1dtqd2">
                                <rect
                                  id="SvgjsRect7116"
                                  width="110"
                                  height="108"
                                  x="0"
                                  y="0"
                                  rx="0"
                                  ry="0"
                                  opacity="1"
                                  stroke-width="0"
                                  stroke="none"
                                  stroke-dasharray="0"
                                  fill="#fff"
                                ></rect>
                              </clipPath>
                              <clipPath id="forecastMask3s1dtqd2"></clipPath>
                              <clipPath id="nonForecastMask3s1dtqd2"></clipPath>
                            </defs>
                            <g id="SvgjsG7119" className="apexcharts-radialbar">
                              <g id="SvgjsG7120">
                                <g
                                  id="SvgjsG7121"
                                  className="apexcharts-tracks"
                                >
                                  <g
                                    id="SvgjsG7122"
                                    className="apexcharts-radialbar-track apexcharts-track"
                                    rel="1"
                                  >
                                    <path
                                      id="apexcharts-radialbarTrack-0"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                      fill="none"
                                      fill-opacity="1"
                                      stroke="rgba(118,213,191,0.85)"
                                      stroke-opacity="0.2"
                                      stroke-linecap="round"
                                      stroke-width="12.775609756097563"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 1 1 54.99425318419944 21.073171233211603 "
                                    ></path>
                                  </g>
                                </g>
                                <g id="SvgjsG7124">
                                  <g
                                    id="SvgjsG7126"
                                    className="apexcharts-series apexcharts-radial-series"
                                    seriesName="Cricket"
                                    rel="1"
                                    data:realIndex="0"
                                  >
                                    <path
                                      id="SvgjsPath7127"
                                      d="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 0 1 68.91547934999863 83.84184176827993 "
                                      fill="none"
                                      fill-opacity="0.85"
                                      stroke="rgba(118,213,191,0.85)"
                                      stroke-opacity="1"
                                      stroke-linecap="round"
                                      stroke-width="13.170731707317074"
                                      stroke-dasharray="0"
                                      className="apexcharts-radialbar-area apexcharts-radialbar-slice-0"
                                      data:angle="155"
                                      data:value="43"
                                      index="0"
                                      j="0"
                                      data:pathOrig="M 55 21.073170731707314 A 32.926829268292686 32.926829268292686 0 0 1 68.91547934999863 83.84184176827993 "
                                    ></path>
                                  </g>
                                  <circle
                                    id="SvgjsCircle7125"
                                    r="26.539024390243902"
                                    cx="55"
                                    cy="54"
                                    className="apexcharts-radialbar-hollow"
                                    fill="transparent"
                                  ></circle>
                                </g>
                              </g>
                            </g>
                            <line
                              id="SvgjsLine7128"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke="#b6b6b6"
                              stroke-dasharray="0"
                              stroke-width="1"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs"
                            ></line>
                            <line
                              id="SvgjsLine7129"
                              x1="0"
                              y1="0"
                              x2="110"
                              y2="0"
                              stroke-dasharray="0"
                              stroke-width="0"
                              stroke-linecap="butt"
                              className="apexcharts-ycrosshairs-hidden"
                            ></line>
                          </g>
                          <g
                            id="SvgjsG7117"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                          ></g>
                          <g
                            id="SvgjsG7118"
                            className="apexcharts-datalabels-group"
                            transform="translate(0, 0) scale(1)"
                          ></g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      {/* Charts Section */}
      <div className="row g-4 mt-4">
        <div className="col-12 col-lg-8">
          <div className="card premium-card border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Performance Overview</h5>
              <div className="chart-container-wrapper">
                <ReactApexChart
                  options={revenueOptions}
                  series={revenueSeries}
                  type="area"
                  height={350}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card premium-card border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Lead Status</h5>
              <div
                className="d-flex justify-content-center align-items-center h-100"
                style={{ minHeight: "300px" }}
              >
                {stats.totalLeads === 0 ? (
                  <p className="text-muted">No leads available</p>
                ) : (
                  <ReactApexChart
                    options={leadChartOptions}
                    series={leadChartSeries}
                    type="donut"
                    width="100%"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
       
        
      </div>
    </div>
  );
}

export default Dashboard;
