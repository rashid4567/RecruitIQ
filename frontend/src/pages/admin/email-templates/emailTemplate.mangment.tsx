'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft, Edit2, Copy, Trash2, Search, Plus, 
  Mail, FileText, RefreshCw, Eye, MailIcon, 
  ChevronRight, ChevronsLeft, ChevronsRight,
  Filter, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { emailTemplateService } from '../../../services/admin/admin.emailTemplate.service'
import type { EmailTemplate } from '../../../types/admin/email-template.types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'react-hot-toast'
import Sidebar from '../../../components/admin/sideBar'

export default function EmailTemplateManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Templates')
  const [currentPage, setCurrentPage] = useState(1)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showTestEmailDialog, setShowTestEmailDialog] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  
  const navigate = useNavigate()

  const categories = [
    'All Templates',
    'Application Status',
    'Interview Related',
    'Account Related',
    'Subscription Related'
  ]

  const eventsMap = {
    'JOB_APPLIED': 'Application Status',
    'INTERVIEW_SCHEDULED': 'Interview Related',
    'SELECTED': 'Application Status',
    'REJECTED': 'Application Status',
    'ACCOUNT_CREATED': 'Account Related',
    'SUBSCRIPTION_EXPIRING': 'Subscription Related',
    'SUBSCRIPTION_EXPIRED': 'Subscription Related'
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      const data = await emailTemplateService.getAll()
      setTemplates(data)
    } catch (error) {
      toast.error('Failed to load templates')
      console.error('Error fetching templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    try {
      await emailTemplateService.delete(id);
      toast.success("Template deleted successfully");
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete template"
      );
    }
  };

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      const newTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      setTemplates([...templates, newTemplate as EmailTemplate])
      toast.success('Template duplicated successfully')
    } catch (error) {
      toast.error('Failed to duplicate template')
    }
  }

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await emailTemplateService.toggle(id, { isActive: !isActive })
      setTemplates(templates.map(t => 
        t.id === id ? { ...t, isActive: !isActive } : t
      ))
      toast.success('Template status updated')
    } catch (error) {
      toast.error('Failed to update template status')
    }
  }

  const handleSendTestEmail = async () => {
    if (!selectedTemplateId || !testEmailAddress) {
      toast.error("Template or email missing");
      return;
    }

    try {
      await emailTemplateService.sendTestEmail(
        selectedTemplateId,
        { email: testEmailAddress }
      );

      toast.success("Test email sent successfully");
      setShowTestEmailDialog(false);
      setTestEmailAddress("");
      setSelectedTemplateId(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send test email"
      );
    }
  };

  const filteredTemplates = templates
    .filter((template): template is NonNullable<typeof template> => template != null)
    .filter(template => {
      const matchesSearch =
        template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

      const matchesCategory =
        activeCategory === 'All Templates' ||
        eventsMap[template.event as keyof typeof eventsMap] === activeCategory;

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' ? template.isActive : !template.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    });

  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage)
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Application Status': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Interview Related': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'Account Related': 'bg-cyan-100 text-cyan-800 border border-cyan-200',
      'Subscription Related': 'bg-purple-100 text-purple-800 border border-purple-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border border-gray-200'
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border border-green-200' 
      : 'bg-red-100 text-red-800 border border-red-200'
  }

  const getCategoryFromEvent = (event: string) => {
    return eventsMap[event as keyof typeof eventsMap] || 'Other'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading email templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Admin</span>
                <span>›</span>
                <span>Notifications & Email Management</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">Email Template Management</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="w-8 h-8 text-indigo-600" />
                Email Template Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/admin/email-logs')}
              >
                <MailIcon size={18} />
                Email Logs
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={fetchTemplates}
              >
                <RefreshCw size={18} />
                Refresh
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                onClick={() => navigate('/admin/email-templates/create')}
              >
                <Plus size={18} />
                Create Template
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            Manage and customize email templates for automated notifications
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Templates</p>
                    <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-600 to-blue-700 p-3 rounded-lg text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Active</p>
                    <p className="text-3xl font-bold text-green-700">
                      {templates.filter(t => t.isActive).length}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-green-600 to-green-700 p-3 rounded-lg text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Categories</p>
                    <p className="text-3xl font-bold text-indigo-700">
                      {new Set(templates.map(t => getCategoryFromEvent(t.event))).size}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-indigo-600 to-indigo-700 p-3 rounded-lg text-white">
                    <Filter className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">Last Updated</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {templates.length > 0 
                        ? formatDate(templates.sort((a, b) => 
                            new Date( b.createdAt).getTime() - 
                            new Date( a.createdAt).getTime()
                          )[0].createdAt || templates[0].createdAt)
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-purple-600 to-purple-700 p-3 rounded-lg text-white">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates by name, subject, or event..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  {['All Templates', 'Active', 'Inactive'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        if (filter === 'All Templates') {
                          setActiveCategory('All Templates')
                          setSelectedStatus('all')
                        } else if (filter === 'Active') {
                          setSelectedStatus('active')
                        } else {
                          setSelectedStatus('inactive')
                        }
                        setCurrentPage(1)
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        (filter === 'All Templates' && activeCategory === 'All Templates') ||
                        (filter === 'Active' && selectedStatus === 'active') ||
                        (filter === 'Inactive' && selectedStatus === 'inactive')
                          ? 'bg-indigo-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                <Select value={activeCategory} onValueChange={(value) => {
                  setActiveCategory(value)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger className="w-45">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <div className="inline-flex p-4 bg-gray-100 rounded-xl mb-4">
                <Mail className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Templates Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || activeCategory !== 'All Templates' || selectedStatus !== 'all'
                  ? "No templates match your search criteria. Try adjusting your filters."
                  : "No email templates created yet. Create your first template to get started!"}
              </p>
              <Button
                onClick={() => navigate('/admin/email-templates/create')}
                className="gap-2"
              >
                <Plus size={18} />
                Create First Template
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedTemplates.map(template => (
                  <Card key={template.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{template.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(template.isActive)}`}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(getCategoryFromEvent(template.event))}`}>
                            {getCategoryFromEvent(template.event)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(template.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 truncate">
                          Event: <span className="font-medium">{template.event}</span>
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4" title={template.subject}>
                          Subject: {template.subject}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/email-templates/${template.id}`)}
                            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/email-templates/edit/${template.id}`)}
                            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTemplateId(template.id)
                              setShowTestEmailDialog(true)
                            }}
                            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Send Test"
                          >
                            <MailIcon size={18} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDuplicateTemplate(template)}
                            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy size={18} />
                          </button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={18} />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{template.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Template
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-white border border-gray-300 rounded-xl shadow-sm">
                  <div className="text-sm text-gray-600">
                    Showing {paginatedTemplates.length} of {filteredTemplates.length} templates
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronsLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="gap-2"
                    >
                      <ChevronRight size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="gap-2"
                    >
                      <ChevronsRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Test Email Dialog */}
      <AlertDialog open={showTestEmailDialog} onOpenChange={setShowTestEmailDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Test Email</AlertDialogTitle>
            <AlertDialogDescription>
              Enter an email address to send a test version of this template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSendTestEmail}
              disabled={!testEmailAddress}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Send Test Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}