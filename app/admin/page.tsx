"use client"

import { Nav } from "@/components/core/nav";
import Altcha from "@/components/core/altcha";
import { authClient } from "@/util/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TbShield,
  TbUsers,
  TbSend,
  TbCheck,
  TbX,
  TbClock,
  TbEdit,
  TbNotes,
  TbChartLine as TbChart,
  TbSettings,
  TbTrendingUp,
  TbCalendar,
  TbEye,
  TbUserMinus,
} from "react-icons/tb";

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  serviceDescription: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  adminNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  priceStatus: string;
  joinLink?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  users: {
    userId: string;
    userName: string;
    userEmail: string;
    grantedAt: string;
  }[];
}

interface ActivityData {
  requestActivity: Array<{ date: string; count: number; status: string }>;
  userActivity: Array<{ date: string; count: number }>;
  accessActivity: Array<{ date: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    status: string;
    createdAt: string;
    userName: string;
    serviceName: string;
  }>;
  servicePopularity: Array<{
    serviceName: string;
    requestCount: number;
    approvedCount: number;
  }>;
  totals: {
    totalRequests: number;
    totalUsers: number;
    totalAccess: number;
  };
  period: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'requests' | 'services'>('overview');
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [editingService, setEditingService] = useState<string | null>(null);
  const [serviceSettings, setServiceSettings] = useState({
    enabled: true,
    priceStatus: "open" as "open" | "invite-only" | "by-request",
    description: "",
    joinLink: ""
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isPending && !session) {
      router.push("/login?message=Please sign in to access the admin dashboard");
    }
  }, [session, isPending, mounted, router]);

  useEffect(() => {
    if (session && (session.user as ExtendedUser).role !== 'admin') {
      router.push("/dashboard?message=Access denied: Admin privileges required");
    }
  }, [session, router]);

  useEffect(() => {
    if (session && (session.user as ExtendedUser).role === 'admin' && accessGranted) {
      fetchData();
    }
  }, [session, accessGranted]);

  useEffect(() => {
    if (session && (session.user as ExtendedUser).role === 'admin' && accessGranted) {
      fetchData();
    }
  }, [activeTab, session, accessGranted]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, requestsResponse, servicesResponse, activityResponse] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/requests"),
        fetch("/api/admin/services"),
        fetch("/api/admin/activity?period=7")
      ]);

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData.requests);
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services);
      }

      if (activityResponse.ok) {
        const activityResponseData = await activityResponse.json();
        setActivityData(activityResponseData);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaVerification = (token: string) => {
    if (token) {
      setAccessGranted(true);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const updateRequestStatus = async (requestId: string) => {
    try {
      const response = await fetch("/api/admin/requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          status: requestStatus,
          adminNotes: adminNotes || undefined
        }),
      });

      if (response.ok) {
        setRequests(requests.map(request =>
          request.id === requestId
            ? { ...request, status: requestStatus, adminNotes, reviewedAt: new Date().toISOString() }
            : request
        ));
        setEditingRequest(null);
        setAdminNotes("");
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const grantServiceAccess = async (userId: string, serviceId: string) => {
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: 'grant', userId, serviceId }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error granting service access:", error);
    }
  };

  const revokeServiceAccess = async (userId: string, serviceId: string) => {
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: 'revoke', userId, serviceId }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error revoking service access:", error);
    }
  };

  const updateService = async (serviceId: string) => {
    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          enabled: serviceSettings.enabled,
          priceStatus: serviceSettings.priceStatus,
          description: serviceSettings.description,
          joinLink: serviceSettings.joinLink
        }),
      });

      if (response.ok) {
        setEditingService(null);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <TbClock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <TbCheck className="w-4 h-4 text-green-500" />;
      case 'denied':
        return <TbX className="w-4 h-4 text-red-500" />;
      default:
        return <TbClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'denied':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!mounted || isPending) {
    return (
      <main>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="animate-pulse text-lg">loading...</div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="text-lg">redirecting to login...</div>
        </div>
      </main>
    );
  }

  if ((session.user as ExtendedUser).role !== 'admin') {
    return (
      <main>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="text-lg text-red-600">Access denied: Admin privileges required</div>
        </div>
      </main>
    );
  }

  if (!accessGranted) {
    return (
      <main>
        <Nav />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <TbShield size={48} className="text-red-500 mb-4" />
              <h1 className="text-2xl font-bold mb-4">One More Step</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please complete the CAPTCHA to access your dashboard.
              </p>
              <div className="w-full max-w-md">
                <Altcha onStateChange={(ev) => {
                  if ('detail' in ev) {
                    handleCaptchaVerification(ev.detail.payload || "");
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const totalUsersCount = users.length;
  const adminUsersCount = users.filter(u => u.role === 'admin').length;

  return (
    <main>
      <Nav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-row items-center justify-start gap-3 mb-8">
          <TbShield size={32} className="text-red-500" />
          <h1 className="text-3xl sm:text-4xl font-bold">Admin</h1>
        </div>

        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: TbChart },
            { id: 'users', label: 'Users', icon: TbUsers },
            { id: 'requests', label: 'Requests', icon: TbSend },
            { id: 'services', label: 'Services', icon: TbSettings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'requests' | 'services')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-pulse">loading data...</div>
          </div>
        )}

        {!loading && activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold">{totalUsersCount}</p>
                  </div>
                  <TbUsers className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Admin Users</p>
                    <p className="text-2xl font-bold">{adminUsersCount}</p>
                  </div>
                  <TbShield className="w-8 h-8 text-red-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
                    <p className="text-2xl font-bold">{pendingRequestsCount}</p>
                  </div>
                  <TbClock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Services</p>
                    <p className="text-2xl font-bold">{services.length}</p>
                  </div>
                  <TbSettings className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TbTrendingUp className="w-5 h-5" />
                  Popular Services
                </h3>
                <div className="space-y-3">
                  {activityData?.servicePopularity?.slice(0, 5).map((service, index) => (
                    <div key={service.serviceName} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{service.serviceName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{service.requestCount} requests</span>
                        <div className={`w-3 h-3 rounded-full ${
                          service.approvedCount > service.requestCount / 2 ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TbCalendar className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activityData?.recentActivity?.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'approved' ? 'bg-green-500' :
                        activity.status === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Last 7 Days Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{activityData?.totals?.totalRequests || 0}</p>
                  <p className="text-sm text-gray-600">New Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{activityData?.totals?.totalUsers || 0}</p>
                  <p className="text-sm text-gray-600">New Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{activityData?.totals?.totalAccess || 0}</p>
                  <p className="text-sm text-gray-600">Access Granted</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Grant Service Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (selectedUser && selectedService) {
                      grantServiceAccess(selectedUser, selectedService);
                      setSelectedUser("");
                      setSelectedService("");
                    }
                  }}
                  disabled={!selectedUser || !selectedService}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                >
                  Grant Access
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          service.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {service.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {service.priceStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{service.users.length} users</p>
                        <p className="text-xs text-gray-500">with access</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingService(service.id);
                          setServiceSettings({
                            enabled: service.enabled,
                            priceStatus: service.priceStatus as "open" | "invite-only" | "by-request",
                            description: service.description,
                            joinLink: service.joinLink || ""
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <TbEdit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>

                  {editingService === service.id ? (
                    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Status</label>
                          <select
                            value={serviceSettings.enabled ? 'enabled' : 'disabled'}
                            onChange={(e) => setServiceSettings(prev => ({ ...prev, enabled: e.target.value === 'enabled' }))}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                          >
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Access Type</label>
                          <select
                            value={serviceSettings.priceStatus}
                            onChange={(e) => setServiceSettings(prev => ({ ...prev, priceStatus: e.target.value as "open" | "invite-only" | "by-request" }))}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                          >
                            <option value="open">Open</option>
                            <option value="invite-only">Invite Only</option>
                            <option value="by-request">By Request</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={serviceSettings.description}
                          onChange={(e) => setServiceSettings(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Join Link</label>
                        <input
                          type="url"
                          value={serviceSettings.joinLink}
                          onChange={(e) => setServiceSettings(prev => ({ ...prev, joinLink: e.target.value }))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateService(service.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {service.users.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <TbEye className="w-4 h-4" />
                        Users with Access
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {service.users.map((user) => (
                          <div key={user.userId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{user.userName}</p>
                              <p className="text-xs text-gray-500">{user.userEmail}</p>
                            </div>
                            <button
                              onClick={() => revokeServiceAccess(user.userId, service.id)}
                              className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                            >
                              <TbUserMinus className="w-3 h-3" />
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto -mt-2">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Verified</th>
                    <th className="text-left py-3 px-4 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.emailVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.emailVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as 'user' | 'admin')}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && activeTab === 'requests' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Service Requests</h2>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{request.userName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{request.userEmail}</p>
                      <p className="text-sm mt-1">
                        Requesting access to <strong>{request.serviceName}</strong>
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="text-sm font-medium capitalize">{request.status}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reason:</p>
                    <p className="text-sm">{request.reason}</p>
                  </div>

                  {request.adminNotes && (
                    <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                        <TbNotes className="w-4 h-4" />
                        Admin Notes:
                      </p>
                      <p className="text-sm">{request.adminNotes}</p>
                    </div>
                  )}

                  {editingRequest === request.id ? (
                    <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={requestStatus}
                          onChange={(e) => setRequestStatus(e.target.value as 'pending' | 'approved' | 'denied')}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="denied">Denied</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Admin Notes</label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                          rows={3}
                          placeholder="Add notes for the user..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateRequestStatus(request.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingRequest(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                        {request.reviewedAt && (
                          <span className="ml-4">
                            Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setEditingRequest(request.id);
                          setRequestStatus(request.status);
                          setAdminNotes(request.adminNotes || "");
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <TbEdit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
