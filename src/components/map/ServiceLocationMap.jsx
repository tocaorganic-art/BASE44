
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocateFixed, MapPin } from 'lucide-react';

// Corrige o problema do ícone do marcador que não aparece no build do React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Componente auxiliar para atualizar a visualização do mapa
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Componente auxiliar para capturar eventos de clique no mapa
function MapEvents({ onClick }) {
  const map = useMap();
  useEffect(() => {
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, onClick]);
  return null;
}

export default function ServiceLocationMap({ initialPosition, onLocationSelect }) {
  const trancosoDefault = [-16.5925, -39.0931];
  const [position, setPosition] = useState(initialPosition || trancosoDefault);
  
  const landmarks = [
    { id: 1, name: "Quadrado", position: [-16.5925, -39.0931] },
    { id: 2, name: "Praia dos Nativos", position: [-16.5931, -39.0881] },
    { id: 3, name: "Praia dos Coqueiros", position: [-16.5966, -39.0911] }
  ];

  const handleLocationUpdate = (newPos, zoom = 16) => {
    setPosition(newPos);
    if (onLocationSelect) {
      onLocationSelect(newPos);
    }
  };

  const handleMapClick = (e) => {
    handleLocationUpdate([e.latlng.lat, e.latlng.lng]);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationUpdate([pos.coords.latitude, pos.coords.longitude]);
        },
        (error) => {
            console.error("Erro ao obter localização:", error)
            alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
        }
      );
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="h-[350px] w-full">
          <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
            <ChangeView center={position} zoom={15} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            <Marker position={position}>
              <Popup>Localização selecionada</Popup>
            </Marker>
            <MapEvents onClick={handleMapClick} />
          </MapContainer>
        </div>
        <div className="p-4 bg-slate-50 border-t space-y-3">
          <p className="text-sm text-slate-600">Clique no mapa para definir sua localização principal ou use os atalhos abaixo.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleUseCurrentLocation}>
              <LocateFixed className="w-4 h-4 mr-2" />
              Usar minha localização
            </Button>
            {landmarks.map(landmark => (
              <Button
                key={landmark.id}
                variant="outline"
                size="sm"
                onClick={() => handleLocationUpdate(landmark.position)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {landmark.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
