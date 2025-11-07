import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserData } from '../App';
import { Camera, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner@2.0.3';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onSave: (data: Partial<UserData> & { profileImage?: string }) => void;
}

export function EditProfileModal({ isOpen, onClose, userData, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(userData.name);
  const [salary, setSalary] = useState(userData.salary.toString());
  const [profileImage, setProfileImage] = useState<string>(userData.profileImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo 2MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Por favor, preencha seu nome');
      return;
    }

    const salaryNum = parseFloat(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      toast.error('Por favor, insira um salário válido');
      return;
    }

    onSave({
      name: name.trim(),
      salary: salaryNum,
      profileImage: profileImage || undefined,
    });

    toast.success('Perfil atualizado com sucesso!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Editar Perfil</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Atualize suas informações pessoais
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-purple-600/30">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              {profileImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image-input"
            />

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl"
            >
              <Camera className="w-4 h-4 mr-2" />
              {profileImage ? 'Trocar foto' : 'Adicionar foto'}
            </Button>
          </div>

          {/* Name */}
          <div>
            <Label className="text-gray-900 dark:text-white">Nome</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white mt-2 rounded-2xl"
            />
          </div>

          {/* Salary */}
          <div>
            <Label className="text-gray-900 dark:text-white">Salário Mensal (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="0.00"
              className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white mt-2 rounded-2xl"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
