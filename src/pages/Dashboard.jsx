import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { fetchProperties } from "../features/property/propertySlice";
import { fetchLeads } from "../features/lead/leadSlice";
import { fetchClients } from "../features/client/clientSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { properties, isLoading: propsLoading } = useSelector(state => state.property);
  const { leads, isLoading: leadsLoading } = useSelector(state => state.lead);
  const { clients, isLoading: clientsLoading } = useSelector(state => state.client);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchLeads());
    dispatch(fetchClients());
  }, [dispatch]);

  const stats = useMemo(() => {
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

    return {
      totalLeads: leads.length,
      totalProperties: properties.length,
      totalClients: clients.length,
      leadStatuses: leadStatusesCounts,
    };
  }, [leads, properties, clients]);

  const loading = propsLoading || leadsLoading || clientsLoading;

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
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card premium-card border-0">
            <div className="card-body">
              <div className="stat-label">Total Leads</div>
              <div className="stat-value">{stats.totalLeads}</div>
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
