'use client';

import { useState, useEffect } from 'react';
import { ProtectRoute } from '@/components/auth/protect-route';
import { AppShell } from '@/components/layout/app-shell';
import { USER_ROLES } from '@/components/auth/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface UnexpectedCost {
  id: string;
  date: string;
  department: 'FO' | 'HK';
  category: string;
  description: string;
  amount: number;
  approvedBy: string;
  notes: string;
  createdAt: Date;
}

export default function UnexpectedCostsPage() {
  const [costs, setCosts] = useState<UnexpectedCost[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      department: 'FO',
      category: 'Guest Compensation',
      description: 'Room upgrade compensation',
      amount: 150,
      approvedBy: 'Manager A',
      notes: 'Guest satisfaction issue',
      createdAt: new Date(),
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      department: 'HK',
      category: 'Supplies',
      description: 'Emergency cleaning supplies',
      amount: 85,
      approvedBy: 'Manager B',
      notes: 'Unexpected cleaning need',
      createdAt: new Date(),
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    department: 'FO' as const,
    category: '',
    description: '',
    amount: 0,
    approvedBy: '',
    notes: '',
  });

  const handleAdd = () => {
    if (!formData.category || !formData.description || formData.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCost: UnexpectedCost = {
      id: String(Date.now()),
      ...formData,
      amount: Number(formData.amount),
      createdAt: new Date(),
    };

    setCosts([newCost, ...costs]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      department: 'FO',
      category: '',
      description: '',
      amount: 0,
      approvedBy: '',
      notes: '',
    });
    setIsAdding(false);
    toast.success('Cost added successfully');
  };

  const handleDelete = (id: string) => {
    setCosts(costs.filter(c => c.id !== id));
    toast.success('Cost deleted');
  };

  const totalToday = costs
    .filter(c => c.date === new Date().toISOString().split('T')[0])
    .reduce((sum, c) => sum + c.amount, 0);

  const totalWeek = costs.reduce((sum, c) => sum + c.amount, 0);

  return (
    <ProtectRoute requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.RDM]}>
      <AppShell>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Unexpected Costs</h1>
            <p className="text-muted-foreground mt-2">Track and manage unexpected expenses</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Today's Total</p>
              <p className="text-3xl font-bold text-foreground mt-2">${totalToday.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{costs.filter(c => c.date === new Date().toISOString().split('T')[0]).length} entries</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Week Total</p>
              <p className="text-3xl font-bold text-foreground mt-2">${totalWeek.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{costs.length} entries</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Average Cost</p>
              <p className="text-3xl font-bold text-foreground mt-2">${costs.length > 0 ? (totalWeek / costs.length).toFixed(2) : '0.00'}</p>
              <p className="text-xs text-muted-foreground mt-1">Per entry</p>
            </Card>
          </div>

          {/* Add Form */}
          {isAdding && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Add New Cost</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value as 'FO' | 'HK' })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FO">Front Office</SelectItem>
                        <SelectItem value="HK">Housekeeping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      placeholder="e.g., Guest Compensation"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Brief description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Amount ($)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Approved By</Label>
                    <Input
                      placeholder="Manager name"
                      value={formData.approvedBy}
                      onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input
                    placeholder="Additional notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAdd} className="gap-2">
                    <Check className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Add Button */}
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Cost
            </Button>
          )}

          {/* Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell className="font-medium">{cost.date}</TableCell>
                    <TableCell>{cost.department}</TableCell>
                    <TableCell>{cost.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cost.description}</TableCell>
                    <TableCell className="font-semibold">${cost.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{cost.approvedBy}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cost.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </AppShell>
    </ProtectRoute>
  );
}
