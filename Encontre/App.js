import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Drawer = createDrawerNavigator();


// Função para obter a frase do dia
const getPhraseOfTheDay = () => {
  const phrases = [
    "Que tal explorar um novo sabor hoje?",
    "Vamos descobrir um lugar incrível para relaxar?",
    "Pronto para uma nova aventura gastronômica?",
    "Hoje é dia de saborear o melhor da sua cidade!",
    "Descubra novos tesouros culinários!",
    "Aproveite o dia e conheça um novo local!",
    "Vamos juntos explorar o que a sua cidade tem de melhor?",
  ];
  const dayOfWeek = new Date().getDay(); // 0 (domingo) a 6 (sábado)
  return phrases[dayOfWeek];
};


const HomeScreen = () => {
    const [comercios, setComercios] = useState([]);
    const [filteredComercios, setFilteredComercios] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cidades, setCidades] = useState([]);
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoritos, setFavoritos] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState({});
    const [modalVisible, setModalVisible] = useState(false); // Inicializa como false
    const [isChecked, setIsChecked] = useState(false);
    const [isVerifiedModalVisible, setIsVerifiedModalVisible] = useState(false);
    const [fraseAtual, setFraseAtual] = useState('');


    useEffect(() => {
      const alterarFrase = () => {
        const fraseAleatoria = frasesCarregamento[Math.floor(Math.random() * frasesCarregamento.length)];
        setFraseAtual(fraseAleatoria);
      };
   
      // Altera a frase imediatamente e a cada 5 segundos
      alterarFrase();
      const intervalId = setInterval(alterarFrase, 3000);  // 5000 ms = 5 segundos
   
      return () => clearInterval(intervalId);  // Limpa o intervalo ao desmontar o componente
    }, []);
   


    useEffect(() => {
      if (estado) {
        // Filtra cidades de acordo com o estado selecionado
        const cidadesFiltradas = [...new Set(comercios.filter(comercio => comercio.estado === estado).map(comercio => comercio.cidade))];
        setCidades(cidadesFiltradas);
        setCidade(''); // Reseta a cidade selecionada ao mudar o estado
      } else {
        // Reseta para todas as cidades se nenhum estado estiver selecionado
        setCidades([...new Set(comercios.map(comercio => comercio.cidade))]); 
      }
    }, [estado, comercios]);
    
      const handleVerifiedPress = () => {
          setIsVerifiedModalVisible(true);
      };

    useEffect(() => {
      const verificarPrimeiroAcesso = async () => {
        const aceitouPolitica = await AsyncStorage.getItem('aceitouPolitica');
        if (!aceitouPolitica) {
          setModalVisible(true);
        }
      };
 
      verificarPrimeiroAcesso();
    }, []);
 
    const aceitarPolitica = async () => {
      await AsyncStorage.setItem('aceitouPolitica', 'true');
      setModalVisible(false);
    };


 
    useEffect(() => {
      const carregarComercios = async () => {
        setLoading(true);
        const backends = [
          'https://backendencontre01.azurewebsites.net/comercio',
          'https://backendecontre2.azurewebsites.net/comercio',
          'https://backendencontre3.azurewebsites.net/comercio',
          'https://encontrebackend4.azurewebsites.nets/comercio'
        ];
   
        for (const backend of backends) {
          try {
            const response = await fetch(backend);
            if (!response.ok) {
              continue;
            }
            const data = await response.json();
            setComercios(data);
            setFilteredComercios(data);
   
            const cidadesUnicas = [...new Set(data.map(comercio => comercio.cidade))];
            const estadosUnicos = [...new Set(data.map(comercio => comercio.estado))];
   
            setCidades(cidadesUnicas);
            setEstados(estadosUnicos);
            break;
          } catch {
           
          }
        }
        setLoading(false);

      };
   
    <TouchableOpacity onPress={() => setModalVisible(true)}>
    <Text style={styles.openModalButton}>Abrir Política de Privacidade</Text>
</TouchableOpacity>


 
      const carregarFavoritos = async () => {
        try {
          const favoritosArmazenados = await AsyncStorage.getItem('favoritos');
          if (favoritosArmazenados) {
            setFavoritos(JSON.parse(favoritosArmazenados));
          }
        } catch (error) {
          console.error(error);
        }
      };
 
      carregarComercios();
      carregarFavoritos();
    }, []);
 
    const filtrarComercios = () => {
      const filtrados = comercios.filter(comercio => {
        const cidadeMatch = cidade ? comercio.cidade === cidade : true;
        const estadoMatch = estado ? comercio.estado === estado : true;
        const categoriaMatch = categoria ? comercio.categoria === categoria : true;
        return cidadeMatch && estadoMatch && categoriaMatch;
      });
      setFilteredComercios(filtrados);
    };


    const frasesCarregamento = [
      "Aguarde enquanto carregamos...",
      "Carregando os melhores locais...",
      "Verifique sua conexão se demorar...",
      "Quase lá...",
      "Encontrando os lugares...",
      "Preparando recomendações..."
    ];
   


 
// Renderiza o indicador de carregamento
if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require('./assets/logoencontre.png')}
        style={{ width: 150, height: 250, marginVertical: -50 }}
      />
      <Text style={styles.loadingText}>Seja Bem-Vindo!</Text>
      <Text style={styles.loadingText2}>{fraseAtual}</Text>


    </View>
  );
}


  const abrirLink = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error("Erro ao abrir URL: ", err));
    } else {
      console.warn("URL não está definida");
    }
  };


  const categoryIcons = {
    pizzaria: "pizza",
    lanchonete: "fast-food",
    restaurante: "restaurant",
    igreja: "heart",
    comercio: "storefront",
    "ponto turistico": "location",
    sorveteria: "ice-cream",
    açaiteria: "ice-cream",
    shopping: "cart",
    evento: "calendar",
    cinema: "film",
    mecanica: "build",                // Ícone para mecânica
    Seguros: "shield",                // Ícone para seguros
    cafeteria: "coffee",              // Ícone para cafeteria
    mercado: "shopping-cart",         // Ícone para mercado
    bar: "beer",                      // Ícone para bar
    academia: "fitness",              // Ícone para academia
    livraria: "book",                 // Ícone para livraria
    "pet shop": "paw",                // Ícone para pet shop
    "serviços de beleza": "scissors", // Ícone para serviços de beleza
    clube: "people",                  // Ícone para clube
    "feira de artesanato": "gift",    // Ícone para feira de artesanato
    "centro cultural": "home",        // Ícone para centro cultural
};


  const abrirWhatsApp = (telefone) => {
    const url = `https://api.whatsapp.com/send?phone=${telefone}`;
    Linking.openURL(url).catch(err => console.error("Erro ao abrir WhatsApp: ", err));
  };


  const handlePress = () => {
    // URL que você deseja abrir
    const url = 'https://politicadeprivacidadeencontre.vercel.app/politicadeprivacidadeencontre.html';
    Linking.openURL(url).catch(err => console.error('Erro ao abrir o link', err));
};

const handleLinkPress = (link, name, comercio_id) => {
  if (link) {
      registrarClique(comercio_id, link); // Registra o clique
      abrirLink(link); // Abre o link
  } else {
      Alert.alert("O comerciante optou por não ter essa rede social.", `Não há um link disponível para ${name}.`);
  }
};

// Função para registrar o clique no backend
const registrarClique = async (comercio_id, link) => {
  try {
      const response = await fetch('https://backendencontre01.azurewebsites.net/clique', { // Altere para o URL do seu backend
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              comercio_id,
              link,
          }),
      });

      if (!response.ok) {
          throw new Error('Erro ao registrar o clique');
      }
  } catch (error) {
      console.error('Erro ao registrar clique:', error);
  }
};

const abrirMaps = (endereco) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
  Linking.openURL(url).catch(err => console.error("Erro ao abrir Maps: ", err));
};

  const renderItem = (item) => {
    const iconName = categoryIcons[item.categoria] || "help";
    const isFavorito = favoritos.includes(item);
    const notaAtual = avaliacoes[item.id] || 0;

    const handleLinkPress = (link, name) => {
        if (link) {
            abrirLink(link);
        } else {
            Alert.alert("O comerciante optou por não ter essa rede social.", `Não há um link disponível para ${name}.`);
        }
    };

    return (
      <View style={styles.comercioItem} key={item.id}>
        <View style={styles.comercioHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <View style={styles.iconContainer1}>
              <Icon name={iconName} size={28} color="#0056b3" />
            </View>
          
              <Text style={[styles.comercioTitle, { flexShrink: 1, maxWidth: '80%' }]} numberOfLines={2}>
                {item.nome}
              </Text>
          </View>
        </View>

            <Image
                source={{ uri: item.imagem_capa || 'default-image.jpg' }}
                style={styles.image}
            />

            {/* Seção de Categoria Principal */}
            <View style={styles.categoriasContainer}>
                <Text style={styles.categoriasTitulo}>Categoria:</Text>
                <View style={styles.categoriaItem}>
                    <Icon name={categoryIcons[item.categoria]} size={20} color="#000" />
                    <Text style={styles.categoriaTexto}>{item.categoria}</Text>
                </View>
            </View>
            <View style={styles.horarioContainer}>
    <Icon name="calendar" size={30} color="#af6060" />
    <Text style={styles.horarioTexto}>
      Horário de Funcionamento: {item.horario_funcionamento_feriados || 'Não especificado'}
    </Text>
</View>
            <View style={styles.infoContainer}>
                <Text style={styles.quemSomosTitulo}>
                    <Icon name="people-circle-outline" size={30} color="gray" style={{ transform: [{ rotate: '90deg' }] }} /> Contato:
                </Text>
                <Text style={styles.quemSomosTexto}>
                    <Icon name="business" size={18} color="black" /> Cidade: {item.cidade}
                </Text>
                <Text style={styles.quemSomosTexto}>
                    <Icon name="map" size={18} color="black" /> Estado: {item.estado}
                </Text>
                <Text style={styles.quemSomosTexto}>
                    <Icon name="call" size={18} color="black" /> Telefone: {item.telefone} 
                </Text>
              
                <Text style={styles.quemSomosTexto}>
                    <Icon name="location" size={18} color="black" /> Endereço: {item.endereco || 'Não especificado'}
                </Text>
            </View>
 
            <View style={styles.quemSomosContainer}>
                <Text style={styles.quemSomosTitulo}>
                    <Icon name="chatbubbles" size={27} color="green" style={{ transform: [{ rotate: '90deg' }] }} /> Bora conhecer a gente?
                </Text>
                <Text style={styles.quemSomosTexto}>{item.descricao}</Text>
            </View>

            
            {/* Modal para Política de Privacidade */}
            <Modal transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Política de Privacidade</Text>
                        <Text style={styles.modalText}>
                            Para continuar, é necessário que você leia e esteja ciente:
                        </Text>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setIsChecked(!isChecked)}
                        >
                            <View style={isChecked ? styles.checked : styles.unchecked}>
                                {isChecked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>
                                Confirmo que estou ciente dos dados que serão coletados e que revisei a política de privacidade.
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePress} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Leia nossa Política de Privacidade</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={aceitarPolitica} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Concordo com a Política de Privacidade</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal para Comércio Verificado */}
            <Modal
                transparent={true}
                visible={isVerifiedModalVisible}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Comércio Verificado pela equipe Encontre</Text>
                        <Text style={styles.modalText}>
                            O que isso significa? Significa que esse comércio passou pelos testes de qualidade,
                            assim verificado que fornece excelente atendimento aos clientes e funcionários.
                            Nossa verificação é feita por testes de qualidade e opiniões de clientes.
                        </Text>
                        <TouchableOpacity onPress={() => setIsVerifiedModalVisible(false)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.quemSomosContainer}>
                <Text style={styles.quemSomosTitulo}>
                    <Icon name="earth-outline" size={27} color="blue" style={{ transform: [{ rotate: '90deg' }] }} /> Redes sociais:
                </Text>
                <View style={styles.linksContainer}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="reader-outline"
                            size={30}
                            color="#763c05"
                            onPress={() => {
                                handleLinkPress(item.link_cardapio, 'Cardápio', item.id);
                                registrarClique(item.id, item.link_cardapio);
                            }}
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="logo-facebook"
                            size={30}
                            color="#3b5998"
                            onPress={() => {
                                handleLinkPress(item.link_facebook, 'Facebook', item.id);
                                registrarClique(item.id, item.link_facebook);
                            }}
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="logo-instagram"
                            size={30}
                            color="#e1306c"
                            onPress={() => {
                                handleLinkPress(item.link_instagram, 'Instagram', item.id);
                                registrarClique(item.id, item.link_instagram);
                            }}
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="logo-whatsapp"
                            size={30}
                            color="#25D366"
                            onPress={() => {
                                registrarClique(item.id, 'WhatsApp');
                                abrirWhatsApp(item.telefone);
                            }}
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="location-outline"
                            size={30}
                            color="green"
                            onPress={() => {
                                registrarClique(item.id, 'Maps');
                                abrirMaps(item.endereco);
                            }}
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="cart-outline"
                            size={35}
                            color="#4285F4"
                            onPress={() => {
                                handleLinkPress(item.link_site_pessoal, 'Site Pessoal', item.id);
                                registrarClique(item.id, item.link_site_pessoal);
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
      <Image
      source={require('./assets/logoencontre.png')} // Substitua pelo caminho da sua imagem
      style={{ width: 120, height: 230, marginVertical:-40, }} // Ajuste o tamanho conforme necessário
    />
   
        <Text style={styles.title3}>{getPhraseOfTheDay()}</Text>
      </View>
      <Picker
        selectedValue={categoria}
        style={styles.picker}
        onValueChange={(itemValue) => setCategoria(itemValue)}
      >
        <Picker.Item label="Todas as Categorias" value="" />
        <Picker.Item label="Açaiteria" value="açaiteria" />
<Picker.Item label="Academia" value="academia" />
<Picker.Item label="Agência de Viagens" value="agencia de viagens" />
<Picker.Item label="Ateliê" value="atelie" />
<Picker.Item label="Bar" value="bar" />
<Picker.Item label="Cafeteria" value="cafeteria" />
<Picker.Item label="Cafeteria Vegana" value="cafeteria vegana" />
<Picker.Item label="Casa de Shows" value="casa de shows" />
<Picker.Item label="Centro Esportivo" value="centro esportivo" />
<Picker.Item label="Cervejaria" value="cervejaria" />
<Picker.Item label="Cinemas" value="cinema" />
<Picker.Item label="Clínica de Estética" value="clinica de estetica" />
<Picker.Item label="Comércio" value="comercio" />
<Picker.Item label="Evento" value="evento" />
<Picker.Item label="Espaço Coworking" value="espaco coworking" />
<Picker.Item label="Escola de Música" value="escola de musica" />
<Picker.Item label="Estúdio de Fotografia" value="estudio de fotografia" />
<Picker.Item label="Estúdio de Yoga" value="estudio de yoga" />
<Picker.Item label="Empreendimentos Sustentáveis" value="empreendimentos sustentaveis" />
<Picker.Item label="Farmácia" value="farmacia" />
<Picker.Item label="Igreja" value="igreja" />
<Picker.Item label="Lanchonete" value="lanchonete" />
<Picker.Item label="Livraria" value="livraria" />
<Picker.Item label="Loja de Brinquedos" value="loja de brinquedos" />
<Picker.Item label="Loja de Móveis" value="loja de moveis" />
<Picker.Item label="Loja de Roupas" value="loja de roupas" />
<Picker.Item label="Pet Shop" value="pet shop" />
<Picker.Item label="Pizzaria" value="pizzaria" />
<Picker.Item label="Ponto Turístico" value="ponto turistico" />
<Picker.Item label="Pousadas e Hotéis" value="pousadas e hoteis" />
<Picker.Item label="Restaurante" value="restaurante" />
<Picker.Item label="Restaurante Vegetariano" value="restaurante vegetariano" />
<Picker.Item label="Salão de Beleza" value="salao de beleza" />
<Picker.Item label="Serviços de Beleza" value="serviços de beleza" />
<Picker.Item label="Shopping" value="shopping" />
<Picker.Item label="Sorveteria" value="sorveteria" />
<Picker.Item label="Terapias Alternativas" value="terapias alternativas" />
      </Picker>
      <View style={styles.row}>
      <Picker
  selectedValue={estado}
  style={styles.pickerHalf}
  onValueChange={(itemValue) => setEstado(itemValue)}
>
  <Picker.Item label="Estado" value="" />
  {estados.map((estado) => (
    <Picker.Item key={estado} label={estado} value={estado} />
  ))}
</Picker>

<Picker
  selectedValue={cidade}
  style={styles.pickerHalf}
  onValueChange={(itemValue) => setCidade(itemValue)}
>
  <Picker.Item label="Cidade" value="" />
  {cidades.map((cidade) => (
    <Picker.Item key={cidade} label={cidade} value={cidade} />
  ))}
</Picker>
      </View>
      <View style={{ alignItems: 'center', width: '100%' }}>
    <TouchableOpacity
        onPress={filtrarComercios}
        style={styles.iconButton}
    >
        <Icon name="filter-circle" size={38} color="#0056b3" />
    </TouchableOpacity>
    <Text style={styles.filtrarTexto}>Filtrar</Text>
</View>

{filteredComercios.length === 0 ? (
    <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>
            Estamos buscando comércios para esta categoria. Volte mais tarde!
        </Text>
    </View>
) : (
    filteredComercios.map(renderItem)
)}


      {filteredComercios.map(renderItem)}
      <View style={styles.footer2}>
        <Text style={styles.footerText}>Encontre by GeoConecta ®</Text>
      </View>
    </ScrollView>
  );
};

const colaboradores = [
  {
    nome: 'Guilherme Lopes Rocetom',
    cargo: 'Co-Fundador Encontre e GeoConecta',
    imagem: require('./assets/IMG_20240614_190940_745.webp'),
  },
  {
    nome: 'Hiasmin Lorrane Cardoso',
    cargo: 'Co-Fundadora Encontre e GeoConecta',
    imagem: require('./assets/Screenshot_20241020-155001.png'),
  },
];

const SobreScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./assets/logoencontre.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.aboutContainer}>
        <Text style={styles.title}>Encontre</Text>
        <Text style={styles.description}>
        Fundada em 2024 na cidade de São Carlos, SP, a Encontre nasceu da proposta de ajudar as pessoas a descobrir novos lugares, tanto na sua cidade quanto em outras. Nossa plataforma organiza esses locais por categorias, facilitando a busca por novidades e experiências únicas. 
        </Text>
        
        <Text style={styles.aboutTitle}>Equipe Encontre:</Text>
        {colaboradores.map((colaborador, index) => (
          <View key={index} style={styles.colaborador}>
            <Image source={colaborador.imagem} style={styles.colaboradorImage} />
            <View style={styles.colaboradorInfo}>
              <Text style={styles.colaboradorNome}>{colaborador.nome}</Text>
              <Text style={styles.colaboradorCargo}>{colaborador.cargo}</Text>
            </View>
          </View>
          
        ))}
      </View>
      <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Redes Socias</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/16994392545')}>
              <Icon name="logo-whatsapp" size={30} color="#25D366" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/encontreapp_1')}>
              <Icon name="logo-instagram" size={30} color="#E1306C" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://encontresite.vercel.app/')}>
              <Icon name="globe" size={30} color="#007BFF" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Encontre by GeoConecta ®</Text>
      </View>
    </ScrollView>
  );
};



  const PoliticaDePrivacidadeScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('./assets/logoencontre.png')}
                    style={{ width: 150, height: 250 }}
                />
            </View>
            <Text style={styles.title2}>Política de Privacidade</Text>


            <Text style={styles.sectionTitle}>1. INFORMAÇÕES GERAIS</Text>
            <Text style={styles.text}>
                Esta Política de Privacidade descreve como o aplicativo
                <Text style={{ fontWeight: 'bold' }}> Encontre </Text>
                coleta, utiliza e protege as informações pessoais de usuários e comerciantes, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei 13.709/18), o Regulamento Geral sobre a Proteção de Dados da União Europeia (GDPR) e outras legislações relevantes dos Estados Unidos, como a Lei de Proteção da Privacidade do Consumidor da Califórnia (CCPA).
            </Text>


            <Text style={styles.sectionTitle}>2. DADOS COLETADOS</Text>
            <Text style={styles.text}>
                Os comerciantes que se cadastram no
                <Text style={{ fontWeight: 'bold' }}> Encontre </Text>
                precisam fornecer as seguintes informações:
            </Text>
            <Text style={styles.text}>- Nome do comércio</Text>
            <Text style={styles.text}>- Telefone do comércio</Text>
            <Text style={styles.text}>- Cidade e estado</Text>
            <Text style={styles.text}>- Imagem de capa</Text>
            <Text style={styles.text}>- Links das redes sociais</Text>
            <Text style={styles.text}>- Descrição detalhada do comércio, incluindo produtos e serviços oferecidos</Text>


            <Text style={styles.text}>
                Esses dados são utilizados exclusivamente para facilitar a comunicação e a negociação entre comerciantes e usuários, sendo enviados diretamente para o WhatsApp. Não armazenamos essas informações em nossos servidores.
            </Text>


            <Text style={styles.sectionTitle}>3. VALIDAÇÃO DO COMÉRCIO</Text>
            <Text style={styles.text}>
                A equipe do
                <Text style={{ fontWeight: 'bold' }}> Encontre </Text>
                realiza uma verificação cuidadosa para garantir que os comerciantes atendam aos nossos critérios de qualidade e confiabilidade. Este processo pode envolver feedback de clientes e, em alguns casos, visitas pessoais ao local.
            </Text>


            <Text style={styles.sectionTitle}>4. POLÍTICA DE PAGAMENTO</Text>
            <Text style={styles.text}>
                Atualmente, o aplicativo não realiza processamento de pagamentos. No caso de não pagamento, o comércio será removido dos canais utilizados pelo
                <Text style={{ fontWeight: 'bold' }}> Encontre </Text>
                para promover seus serviços. Essa medida visa manter a qualidade e a transparência na plataforma.
            </Text>


            <Text style={styles.sectionTitle}>5. CONTEÚDO E FAIXA ETÁRIA</Text>
            <Text style={styles.text}>
                O
                <Text style={{ fontWeight: 'bold' }}> Encontre </Text>
                proíbe estritamente a publicação de conteúdo impróprio. O aplicativo é destinado a usuários com idade mínima de 17 anos, assegurando um ambiente seguro e adequado para todos.
            </Text>


            <Text style={styles.sectionTitle}>6. CONSENTIMENTO</Text>
            <Text style={styles.text}>
                Ao utilizar o aplicativo
                <Text style={{ fontWeight: 'bold' }}> Encontre </Text>
                o usuário consente com a coleta e o uso das informações de acordo com esta Política de Privacidade. Recomendamos que os usuários revisem esta política periodicamente para se manterem informados sobre quaisquer alterações.
            </Text>


            <Text style={styles.sectionTitle}>7. DIREITOS DOS USUÁRIOS</Text>
            <Text style={styles.text}>
                Em conformidade com a LGPD, GDPR e CCPA, os usuários têm o direito de:
            </Text>
            <Text style={styles.text}>- Acessar suas informações pessoais;</Text>
            <Text style={styles.text}>- Corrigir dados imprecisos;</Text>
            <Text style={styles.text}>- Solicitar a exclusão de suas informações;</Text>
            <Text style={styles.text}>- Receber informações claras sobre o uso de seus dados;</Text>
            <Text style={styles.text}>- Retirar o consentimento a qualquer momento.</Text>


            <Text style={styles.sectionTitle}>8. ALTERAÇÕES NA POLÍTICA DE PRIVACIDADE</Text>
            <Text style={styles.text}>
                Reservamos o direito de modificar esta Política de Privacidade a qualquer momento. As alterações serão comunicadas por meio do aplicativo e recomendamos que tanto usuários quanto comerciantes revisem esta seção regularmente.
            </Text>


            <Text style={styles.sectionTitle}>9. CONTATO</Text>
            <Text style={styles.text}>
                Se você tiver dúvidas ou solicitações relacionadas a esta política, entre em contato conosco pelo e-mail: guilhermedevsistemas@gmail.com.
            </Text>


            <Text style={styles.sectionTitle}>10. JURISDIÇÃO PARA RESOLUÇÃO DE CONFLITOS</Text>
            <Text style={styles.text}>
                Para resolver quaisquer controvérsias decorrentes desta Política de Privacidade, aplicaremos integralmente a legislação brasileira, o GDPR para usuários da UE e a CCPA para usuários da Califórnia. Os litígios deverão ser apresentados no foro da comarca onde se localiza a sede da empresa.
            </Text>
            <View style={styles.footer}>
        <Text style={styles.footerText}>Encontre by GeoConecta ®</Text>
      </View>
        </ScrollView>
    );
};
 


const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Lar">
        <Drawer.Screen 
          name="Feed" 
          component={HomeScreen} 
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="earth-outline" size={23} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Política de Privacidade" 
          component={PoliticaDePrivacidadeScreen} 
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="shield-checkmark-outline" size={23} color={color} />
            ),
          }} 
        />
        <Drawer.Screen 
          name="Sobre-Nós" 
          component={SobreScreen} 
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="people-circle-outline" size={23} color={color} />
            ),
          }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};





const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
    title: {
      fontSize: 24, // Tamanho da fonte
      fontWeight: 'bold', // Peso da fonte
      color: '#333', // Cor do texto
      marginLeft: 10, // Espaço à esquerda
      textAlign: 'left', // Alinhamento do texto
      lineHeight: 30, // Altura da linha para melhor legibilidade
  },
title3: {
  fontSize: 20, // Tamanho da fonte
  fontWeight: 'bold', // Peso da fonte
  color: '#333', // Cor do texto
  marginLeft: 10, // Espaço à esquerda
  textAlign: 'left', // Alinhamento do texto
  lineHeight: 30, // Altura da linha para melhor legibilidade
},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerHalf: {
    height: 50,
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#e8e8e8',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#e8e8e8',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconContainer: {
    alignItems: 'center', // Centraliza ícones e rótulos
    marginHorizontal: 10, // Espaço horizontal entre os ícones
  },
  dataTexto: {
    fontSize: 16, // Tamanho da fonte
    color: '#555', // Cor do texto
    fontStyle: 'italic', // Estilo da fonte (opcional)
    marginVertical: 5, // Espaçamento vertical
    textAlign: 'left', // Alinhamento do texto
},
  iconLabel: {
    fontSize: 14, // Tamanho do texto para o rótulo
    color: '#333', // Cor do texto
    marginTop: 5, // Espaçamento entre o ícone e o rótulo
  },
 
  infoContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: 'white', // Cor de fundo leve para destacar
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconButton: {
    padding: 10,
    marginLeft: 30,
  },
  comercioItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 40,
    borderColor: '#7ad1ff',
    borderWidth: 1.5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 0,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'black',
  },
  comercioTitle: {
    fontSize: 22,
    fontWeight: 'regular',
    color: '#000',
  },
  comercioDescricao: {
    fontSize: 18,
    fontWeight: 'medium',
    color: 'black',
    marginTop: 5,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical:-15,
    marginBottom: 20,
  },
  title2: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical:-80,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#0056b3',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputHalf: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '48%',
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3, // Shadow effect
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 15,
    color: '#0056b3',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: '#333',
  },
  plansContainer: {
    marginVertical: 10, // Reduzido de 20 para 10
    padding: 10, // Reduzido de 18 para 10
    backgroundColor: '#e9ecef',
    borderRadius: 15,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 3, // Reduzido de 5 para 3
  },
  planItem: {
    fontSize: 16,
    marginBottom: 3, // Reduzido de 5 para 3
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 38,
    fontWeight: 'medium',
    color: '#0056b3',
    marginVertical:-20,
  },
  loadingText2: {
    fontSize: 22,
    fontWeight: 'medium',
    color: 'black',
    marginVertical:50,
  },
  quemSomosContainer: {
    marginVertical: 10,
    padding: 15, // Espaçamento interno do container principal
    backgroundColor: 'white',
    borderRadius: 28,
    borderColor: '#ccc',
    borderWidth: 1,  
  },
  quemSomosTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quemSomosTexto: {
    fontSize: 16,
    margin:3,
    color: '#333',
  },
 
  icon: {
    marginRight: 10, // Espaçamento entre o ícone e o título
},
comercioHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 10, // Adiciona um espaço vertical entre ícone e título
},
linksContainer: {
  flexDirection: 'row', // Alinha os ícones em linha
  justifyContent: 'space-around', // Espaçamento entre os ícones
  marginVertical: 20, // Margem vertical, se necessário
},


iconContainer: {
  alignItems: 'center', // Centraliza ícones e rótulos
  marginHorizontal: 10, // Espaço horizontal entre os ícones
},


iconLabel: {
  fontSize: 14, // Tamanho do texto para o rótulo
  color: '#333', // Cor do texto
  marginTop: 5, // Espaçamento entre o ícone e o rótulo
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Aumentei a opacidade para um efeito mais intenso
},
modalContent: {
  width: 320, // Largura um pouco maior para conforto
  padding: 25, // Aumentei o padding para um espaço melhor
  backgroundColor: '#fff', // Usei a notação hexadecimal para clareza
  borderRadius: 15, // Bordas mais arredondadas
  shadowColor: '#000', // Sombra para destaque
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5, // Para Android
  alignItems: 'center',
},
modalTitle: {
  fontSize: 20, // Aumentei o tamanho da fonte
  fontWeight: '600', // Mudança para um peso mais leve
  marginBottom: 12, // Aumentei o espaço abaixo do título
  color: '#333', // Cor mais escura para melhor contraste
},
modalText: {
  marginBottom: 25, // Aumentei o espaço abaixo do texto
  textAlign: 'center',
  color: '#555', // Cor um pouco mais suave
},
modalButton: {
  marginTop: 20,
  backgroundColor: '#007BFF',
  paddingVertical: 15, // Usando padding vertical para centralizar melhor o texto
  borderRadius: 6,
  width: '100%', // Botão ocupa toda a largura do modal
},
modalButtonText: {
  color: '#fff',
  fontWeight: '600', // Peso de fonte mais leve
  textAlign: 'center', // Centraliza o texto
},
checkbox: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12, // Aumentei o espaço abaixo do checkbox
},
checked: {
  width: 24,
  height: 24,
  backgroundColor: '#007BFF',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
},
unchecked: {
  width: 24,
  height: 24,
  borderWidth: 2,
  borderColor: '#007BFF',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
},
checkmark: {
  color: '#fff',
  fontSize: 18,
},
checkboxLabel: {
  marginLeft: 12,
  fontSize: 16,
  color: '#333',
},
iconButton: {
  justifyContent: 'center',  
  alignItems: 'center',      
  padding: 0,              
},
filtrarTexto: {
  marginTop: 0,              
  fontSize: 18,              
  color: '#0056b3',          
  textAlign: 'center',    
},
categoriasContainer: {
  marginVertical: 10,
  paddingHorizontal: 10,
},
categoriasTitulo: {
  fontSize: 18,
  fontWeight: 'bold',
},
categoriaItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
},
categoriaTexto: {
  marginLeft: 5,
  fontSize: 16,
},
container: {
  flexGrow: 1,
  padding: 20,
  backgroundColor: '#ffffff',
},
header: {
  alignItems: 'center',
  marginBottom: 20,
},
logo: {
  width: 150,
  height: 150,
  resizeMode: 'cover',
  borderRadius: 75, // Arredonda a imagem
  borderWidth: 2, // Adiciona borda à imagem
  borderColor: '#0056b3', // Cor da borda da imagem
},
aboutContainer: {
  backgroundColor: '#ffffff',
  borderRadius: 27,
  padding: 50,
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  borderWidth: 1, // Adiciona borda à imagem
  borderColor: '#0056b3', // Cor da borda da imagem
},
title: {
  fontSize: 30,
  fontWeight: 'bold',
  marginBottom: 18,
  textAlign: 'center',
  color: '#333',
},
description: {
  fontSize: 15,
  color: '#666',
  marginBottom: 25,
  textAlign: 'left',
 
},
aboutTitle: {
  fontSize: 22,
  fontWeight: '600',
  marginBottom: 20,
  textAlign: 'center',
  color: '#333',
},
colaborador: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 15,
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
},
colaboradorImage: {
  width: 100,
  height: 100,
  borderRadius: 25,
  marginRight: 15,
},
colaboradorInfo: {
  flex: 1,
},
colaboradorNome: {
  fontSize: 18,
  fontWeight: '600',
  color: '#333',
},
colaboradorCargo: {
  fontSize: 14,
  color: '#666',
},
footer: {
  backgroundColor: '#007BFF', // Cor de fundo da barra
  paddingVertical: 12,
  alignItems: 'center',
  marginTop: 20,
  borderRadius: 25,
},
footerText: {
  color: '#fff',
  fontSize: 17,
  fontWeight: 'bold',
},
socialContainer: {
  marginTop: 20,
  alignItems: 'center',
},
socialTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#333',
},
socialIcons: {
  flexDirection: 'row',
  justifyContent: 'center',
},
icon: {
  marginHorizontal: 10,
},
iconContainer1: {
  width: 45, // Largura do container
  height: 45, // Altura do container
  borderRadius: 40, // Para deixar a borda arredondada
  borderWidth: 1.2, // Largura da borda
  borderColor: 'gray', // Cor da borda
  justifyContent: 'center', // Centraliza o ícone
  alignItems: 'center', // Centraliza o ícone
  marginRight: 10, // Espaçamento entre o ícone e o texto
},
horarioContainer: {
  flexDirection: 'row', // Organiza o ícone e o texto em linha
  alignItems: 'center', // Alinha verticalmente o ícone e o texto
  backgroundColor: 'white', // Cor de fundo do container
  borderRadius: 25, // Bordas arredondadas
  padding: 10, // Espaçamento interno do container do horário
  marginVertical: 10, // Espaçamento vertical entre elementos
  borderWidth: 1,
  borderColor: '#ccc',
},
horarioTexto: {
  marginLeft: 10, // Espaçamento entre o ícone e o texto
  fontSize: 16, // Tamanho da fonte do texto
  color: '#333', // Cor do texto
  flexShrink: 1, // Permite que o texto encolha se necessário
  maxWidth: '80%', // Limita a largura do texto
},
noResultsContainer: {
  padding: 40,
  marginTop: 90,
  backgroundColor: '#f8f9fa', // Fundo leve para destacar
  borderRadius: 30, // Bordas arredondadas
  alignItems: 'center', // Centraliza o conteúdo
  justifyContent: 'center',
  width: '90%', // Limita a largura
  alignSelf: 'center', // Centraliza horizontalmente
  shadowColor: '#000', // Sombra para destaque
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 7,
  elevation: 2, // Sombra no Android
  borderColor: 'black',
  borderWidth: 1,
},
noResultsText: {
  fontSize: 18, // Tamanho do texto
  color: '#666', // Cor do texto
  textAlign: 'center', // Centraliza o texto
  fontWeight: '500', // Peso do texto
},
});


export default App;

