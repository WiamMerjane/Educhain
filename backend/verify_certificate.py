# import torch
# from torch import nn, optim
# from torch.utils.data import DataLoader
# from torchvision import models, transforms
# from torch.utils.data import Dataset
# from PIL import Image
# import pathlib
# import os
# from sklearn.metrics import accuracy_score, precision_recall_fscore_support
# import numpy as np

# class CertificationDataset(Dataset):
#     def __init__(self, data_dir, transform=None, augment=False):
#         self.data_dir = pathlib.Path(data_dir)
#         self.transform = transform
#         self.augment = augment
        
#         if not os.path.exists(data_dir):
#             raise ValueError(f"Le dossier {data_dir} n'existe pas!")
        
#         self.image_paths = []
#         self.labels = []
        
#         # Vérification et comptage des images
#         authentic_count = 0
#         fake_count = 0
        
#         print(f"Scanning directory: {data_dir}")
        
#         for class_dir in self.data_dir.iterdir():
#             if class_dir.is_dir():
#                 print(f"Found directory: {class_dir.name}")
#                 label = 1 if class_dir.name == "authentic" else 0
#                 class_images = list(class_dir.glob("*.[jJ][pP][gG]")) + list(class_dir.glob("*.[jJ][pP][eE][gG]"))
                
#                 current_count = len(class_images)
#                 print(f"Found {current_count} images in {class_dir.name}")
                
#                 if label == 1:
#                     authentic_count = current_count
#                 else:
#                     fake_count = current_count
                    
#                 for img_path in class_images:
#                     self.image_paths.append(img_path)
#                     self.labels.append(label)
        
#         if len(self.image_paths) == 0:
#             raise ValueError("Aucune image trouvée dans les dossiers!")
            
#         print(f"Total images trouvées: Authentic={authentic_count}, Fake={fake_count}")
        
#         # Gestion des poids avec vérification pour éviter la division par zéro
#         if authentic_count == 0 or fake_count == 0:
#             print("Warning: Une des classes n'a pas d'images. Utilisation de poids égaux.")
#             self.class_weights = torch.tensor([1.0, 1.0])
#         else:
#             total = authentic_count + fake_count
#             self.class_weights = torch.tensor([
#                 total / (2 * fake_count) if fake_count > 0 else 1.0,
#                 total / (2 * authentic_count) if authentic_count > 0 else 1.0
#             ])
        
#     def __len__(self):
#         return len(self.image_paths)

#     def __getitem__(self, idx):
#         img_path = self.image_paths[idx]
#         try:
#             image = Image.open(img_path).convert('RGB')
#         except Exception as e:
#             print(f"Error loading image {img_path}: {e}")
#             image = Image.new('RGB', (224, 224), 'black')
            
#         label = self.labels[idx]

#         if self.transform:
#             image = self.transform(image)

#         return image, torch.tensor(label, dtype=torch.float32)

# # Vérification de la structure des dossiers
# def verify_data_structure():
#     required_dirs = ['./model/train/authentic', './model/train/fake',
#                     './model/test/authentic', './model/test/fake']
    
#     for dir_path in required_dirs:
#         if not os.path.exists(dir_path):
#             print(f"Création du dossier manquant: {dir_path}")
#             os.makedirs(dir_path, exist_ok=True)

# print("Vérification de la structure des dossiers...")
# verify_data_structure()

# # Transformation des images
# train_transform = transforms.Compose([
#     transforms.Resize((224, 224)),
#     transforms.RandomHorizontalFlip(),
#     transforms.RandomRotation(15),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
# ])

# test_transform = transforms.Compose([
#     transforms.Resize((224, 224)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
# ])

# # Chargement des données avec gestion des erreurs
# try:
#     print("\nChargement du dataset d'entraînement...")
#     train_dataset = CertificationDataset('./model/train', transform=train_transform, augment=True)
#     print("\nChargement du dataset de test...")
#     test_dataset = CertificationDataset('./model/test', transform=test_transform)

#     if len(train_dataset) < 2 or len(test_dataset) < 2:
#         raise ValueError("Pas assez d'images pour l'entraînement!")

#     train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, num_workers=0)
#     test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False, num_workers=0)

# except Exception as e:
#     print(f"\nErreur lors du chargement des données: {e}")
#     print("\nVérifiez que:")
#     print("1. Le dossier 'model' existe avec la structure suivante:")
#     print("   model/")
#     print("   ├── train/")
#     print("   │   ├── authentic/")
#     print("   │   └── fake/")
#     print("   └── test/")
#     print("       ├── authentic/")
#     print("       └── fake/")
#     print("\n2. Chaque dossier contient des images .jpg ou .jpeg")
#     exit(1)

# # Définition du modèle
# class CustomNet(nn.Module):
#     def __init__(self):
#         super(CustomNet, self).__init__()
#         self.base_model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
#         num_ftrs = self.base_model.fc.in_features
#         self.base_model.fc = nn.Sequential(
#             nn.Linear(num_ftrs, 512),
#             nn.ReLU(),
#             nn.Dropout(0.3),
#             nn.Linear(512, 1),
#             nn.Sigmoid()
#         )
    
#     def forward(self, x):
#         return self.base_model(x)

# # Initialisation du modèle
# print("\nInitialisation du modèle...")
# device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
# print(f"Utilisation de: {device}")

# model = CustomNet()
# model.to(device)

# criterion = nn.BCELoss()
# optimizer = optim.Adam(model.parameters(), lr=0.001)
# scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=3, verbose=True)

# # Entraînement
# print("\nDébut de l'entraînement...")
# epochs = 25
# best_val_loss = float('inf')

# try:
#     for epoch in range(epochs):
#         model.train()
#         train_loss = 0.0
#         for inputs, labels in train_loader:
#             inputs, labels = inputs.to(device), labels.to(device)
#             optimizer.zero_grad()
#             outputs = model(inputs)
#             loss = criterion(outputs.squeeze(), labels)
#             loss.backward()
#             optimizer.step()
#             train_loss += loss.item() * inputs.size(0)

#         train_loss = train_loss / len(train_loader.dataset)

#         # Validation
#         model.eval()
#         val_loss = 0.0
#         with torch.no_grad():
#             for inputs, labels in test_loader:
#                 inputs, labels = inputs.to(device), labels.to(device)
#                 outputs = model(inputs)
#                 loss = criterion(outputs.squeeze(), labels)
#                 val_loss += loss.item() * inputs.size(0)

#         val_loss = val_loss / len(test_loader.dataset)
#         scheduler.step(val_loss)

#         print(f"Epoch [{epoch+1}/{epochs}], Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")

#         if val_loss < best_val_loss:
#             best_val_loss = val_loss
#             print("Sauvegarde du meilleur modèle...")
#             torch.save(model.state_dict(), 'certification_model_weights.pth')

# except Exception as e:
#     print(f"\nErreur pendant l'entraînement: {e}")
#     exit(1)

# print("\nEntraînement terminé.")


import torch
from torch import nn
from torchvision import models, transforms
from PIL import Image
import sys

# Charger le modèle pré-entraîné MobileNetV2
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)

# Modifier la dernière couche pour la classification binaire
for param in model.parameters():
    param.requires_grad = False

model.classifier[1] = nn.Sequential(
    nn.Linear(model.classifier[1].in_features, 1024),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(1024, 1),
    nn.Sigmoid()
)

# Charger les poids sauvegardés
model.load_state_dict(torch.load('certification_model_weights.pth'), strict=False)
model.eval()

# Fonction de transformation des images
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_certificate(file_path):
    # Charger l'image et appliquer la transformation
    image = Image.open(file_path).convert('RGB')
    image = transform(image).unsqueeze(0)  # Ajouter une dimension batch
    
    # Envoyer l'image sur le GPU si disponible
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    image = image.to(device)
    model.to(device)

    # Passer l'image dans le modèle pour obtenir la prédiction
    with torch.no_grad():
        output = model(image)
        prediction = output.squeeze()  # Supprimer la dimension inutile
        # print(f"Raw output: {prediction.item()}")  # Afficher la valeur brute de la prédiction

        # Ajuster le seuil de décision
        prediction = (prediction > 0.5).float()  # Seuil de 0.4 pour classifier

        # Retourner "Authentic" ou "Fake" en fonction de la prédiction
        if prediction == 1:
            return "Authentic"
        else:
            return "Fake"

if __name__ == '__main__':
    file_path = sys.argv[1]  # Récupérer le chemin du fichier passé en argument
    result = predict_certificate(file_path)
    print(result)
