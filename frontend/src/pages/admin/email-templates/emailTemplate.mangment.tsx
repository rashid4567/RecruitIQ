'use client'

import  { useState, useEffect } from 'react'
import { 
  ChevronRight, ChevronLeft, Edit2, Copy, Trash2, Search, Plus, 
  Grid3x3, LogOut, Settings, Mail, FileText, Users, UserCheck, 
  BarChart3, LogIn, Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { emailTemplateService } from '../../../services/admin/admin.emailTemplate.service'
import type{ EmailTemplate } from '../../../types/admin/email-template.types'
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

const Loading = () => <div>Loading...</div>

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
  } catch (error : any) {
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
      'Application Status': 'bg-blue-100 text-blue-700',
      'Interview Related': 'bg-indigo-100 text-indigo-700',
      'Account Related': 'bg-cyan-100 text-cyan-700',
      'Subscription Related': 'bg-purple-100 text-purple-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getStatusBadge = (status: boolean) => {
    return status ? 'text-green-600' : 'text-gray-600'
  }

  const getCategoryFromEvent = (event: string) => {
    return eventsMap[event as keyof typeof eventsMap] || 'Other'
  }

  if (isLoading) return <Loading />

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="font-semibold text-gray-900">RecruitIQ</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Grid3x3 size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FileText size={20} />
            <span className="text-sm font-medium">Activity Logs</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <UserCheck size={20} />
            <span className="text-sm font-medium">Recruiter Management</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Users size={20} />
            <span className="text-sm font-medium">Candidate Management</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <LogIn size={20} />
            <span className="text-sm font-medium">Subscribers</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <BarChart3 size={20} />
            <span className="text-sm font-medium">Plans Overview</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg cursor-pointer font-medium">
            <Mail size={20} />
            <span className="text-sm">Email Template Management</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FileText size={20} />
            <span className="text-sm font-medium">Email logs</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        {/* Log Out */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <LogOut size={20} />
            <span className="text-sm font-medium">Log Out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Admin</span>
            <ChevronRight size={16} />
            <span>Notifications & Email Management</span>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium">Email Templates</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-400 to-blue-500"></div>
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Title and Button */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Email Template Management</h1>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                onClick={() => navigate('/admin/email-templates/create')}
              >
                <Plus size={18} />
                Create Custom Template
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="col-span-1">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setActiveCategory(category)
                            setCurrentPage(1)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${activeCategory === category
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="col-span-3">
                {/* Search */}
                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    placeholder="Search templates..."
                    className="pl-10 bg-white border-gray-200"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>

                {/* Grid of Templates */}
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No templates found</p>
                    <Button 
                      onClick={() => navigate('/admin/email-templates/create')}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus size={18} className="mr-2" />
                      Create Your First Template
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      {paginatedTemplates.map(template => (
                        <Card key={template.id} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{template.name}</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(getCategoryFromEvent(template.event))}`}>
                                  {getCategoryFromEvent(template.event)}
                                </span>
                                <span className={`text-xs font-semibold ${getStatusBadge(template.isActive)}`}>
                                  {template.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(template.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-2 truncate">
                              Event: {template.event}
                            </p>
                            <p className="text-xs text-gray-500 mb-4 truncate">
                              Subject: {template.subject}
                            </p>
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => navigate(`/admin/email-templates/edit/${template.id}`)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTemplateId(template.id)
                                  setShowTestEmailDialog(true)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                                title="Send Test"
                              >
                                <Send size={18} />
                              </button>
                              <button
                                onClick={() => handleDuplicateTemplate(template)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Duplicate"
                              >
                                <Copy size={18} />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(template.id, template.isActive)}
                                className={`${template.isActive ? 'text-green-400 hover:text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                                title={template.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {template.isActive ? '✓' : '○'}
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="text-red-400 hover:text-red-600" title="Delete">
                                    <Trash2 size={18} />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the template "{template.name}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteTemplate(template.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-end gap-4 mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </Button>
                        <span className="text-sm font-medium text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2"
                        >
                          Next
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 text-center text-sm text-gray-500">
          © 2025 RecruitFlow Admin. All rights reserved.
        </div>
      </div>

      {/* Test Email Dialog */}
      <AlertDialog open={showTestEmailDialog} onOpenChange={setShowTestEmailDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Test Email</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the email address where you want to send a test of this template.
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