import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
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
  
    useEffect(() => {
      const carregarComercios = async () => {
        setLoading(true);
        try {
          const response = await fetch('https://backendencontre01.azurewebsites.net/comercio');
          const data = await response.json();
          setComercios(data);
          setFilteredComercios(data);
    
          const cidadesUnicas = [...new Set(data.map(comercio => comercio.cidade))];
          const estadosUnicos = [...new Set(data.map(comercio => comercio.estado))];
          
          setCidades(cidadesUnicas);
          setEstados(estadosUnicos);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
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
  
    const toggleFavorito = async (comercio) => {
      let novosFavoritos;
      if (favoritos.some(item => item.id === comercio.id)) { // Considerando que cada comercio tem um id único
        novosFavoritos = favoritos.filter(item => item.id !== comercio.id);
      } else {
        novosFavoritos = [...favoritos, comercio];
      }
      
      setFavoritos(novosFavoritos);
      console.log("Novos Favoritos:", novosFavoritos);
      await AsyncStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
    };
      
  
    // Renderiza o indicador de carregamento
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando Sistema...</Text>
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
    igreja: "church",
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

  const abrirMaps = (cidade) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${cidade}`;
    Linking.openURL(url).catch(err => console.error("Erro ao abrir Maps: ", err));
  };

  const renderItem = (item) => {
    const iconName = categoryIcons[item.categoria] || "help"; // Ícone padrão caso não haja correspondência
    const isFavorito = favoritos.includes(item); // Verifica se o item é favorito
  
    return (
      <View style={styles.comercioItem} key={item.id}>
        <Image
          source={{ uri: item.imagem_capa || 'default-image.jpg' }}
          style={styles.image}
        />
        <View style={styles.comercioHeader}>
          <Icon name={iconName} size={30} color="#0056b3" />
          <Text style={styles.comercioTitle}>{item.nome}</Text>
          <Icon
            name={isFavorito ? "heart" : "heart-outline"}
            size={30}
            color={isFavorito ? "red" : "#000"}
            onPress={() => toggleFavorito(item)} // Adiciona a funcionalidade de toggle
          />
        </View>
        <Text>Cidade: {item.cidade}</Text>
        <Text>Estado: {item.estado}</Text>
        <Text>Telefone: {item.telefone}</Text>
        <Text>Horário: {item.horario_funcionamento}</Text>
        <Text style={styles.comercioDescricao}>Descrição: {item.descricao}</Text> 
        <View style={styles.linksContainer}>
          {item.link_cardapio && (
            <Icon name="book" size={30} color="#000" onPress={() => abrirLink(item.link_cardapio)} />
          )}
          {item.link_facebook && (
            <Icon name="logo-facebook" size={30} color="#3b5998" onPress={() => abrirLink(item.link_facebook)} />
          )}
          {item.link_instagram && (
            <Icon name="logo-instagram" size={30} color="#e1306c" onPress={() => abrirLink(item.link_instagram)} />
          )}
          <Icon name="logo-whatsapp" size={30} color="#25D366" onPress={() => abrirWhatsApp(item.telefone)} />
          <Icon name="map" size={30} color="#FF5722" onPress={() => abrirMaps(item.cidade)} />
        </View>
      </View>
    );
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Icon name="location-outline" size={50} color="#0056b3" />
        <Text style={styles.title}>{getPhraseOfTheDay()}</Text>
      </View>
      <Picker
        selectedValue={categoria}
        style={styles.picker}
        onValueChange={(itemValue) => setCategoria(itemValue)}
      >
        <Picker.Item label="Todas as Categorias" value="" />
        <Picker.Item label="Pizzaria" value="pizzaria" />
        <Picker.Item label="Lanchonete" value="lanchonete" />
        <Picker.Item label="Restaurante" value="restaurante" />
        <Picker.Item label="Igreja" value="igreja" />
        <Picker.Item label="Comércio" value="comercio" />
        <Picker.Item label="Ponto Turístico" value="ponto turistico" />
        <Picker.Item label="Sorveteria" value="sorveteria" />
        <Picker.Item label="Açaiteria" value="açaiteria" />
        <Picker.Item label="Shopping" value="shopping" />
        <Picker.Item label="Evento" value="evento" />
        <Picker.Item label="Cinema" value="cinema" />
        <Picker.Item label="Academia" value="academia" />
        <Picker.Item label="Pet Shop" value="pet shop" /> 
        <Picker.Item label="Cafeteria" value="cafeteria" /> 
        <Picker.Item label="Bar" value="bar" /> 
        <Picker.Item label="Livraria" value="livraria" /> 
        <Picker.Item label="Serviços de Beleza" value="serviços de beleza" /> 
        <Picker.Item label="Centro Cultural" value="centro cultural" /> 
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
      <TouchableOpacity onPress={filtrarComercios} style={styles.iconButton}>
        <Icon name="filter" size={25} color="#0056b3" />
      </TouchableOpacity>
      {filteredComercios.map(renderItem)}
      <Text style={styles.footer}></Text>
    </ScrollView>
  );
};

const CadastroScreen = () => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [telefone, setTelefone] = useState('');
    const [horarioFuncionamento, setHorarioFuncionamento] = useState('');
    const [descricao, setDescricao] = useState('');
  
    const enviarWhatsApp = () => {
      const mensagem = `
        Nome: ${nome}
        Categoria: ${categoria}
        Cidade: ${cidade}
        Estado: ${estado}
        Telefone: ${telefone}
        Horário: ${horarioFuncionamento}
        Descrição: ${descricao}
      `.replace(/\n/g, '%0A');
  
      const numeroWhatsApp = '5531999999999'; // Altere para o número desejado
      const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
      Linking.openURL(url).catch(err => console.error("Erro ao abrir WhatsApp: ", err));
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Icon name="storefront" size={50} color="#0056b3" />
          <Text style={styles.title}>Cadastre seu Negócio</Text>
        </View>
                     {/* Informações sobre os planos */}
      <View style={styles.plansContainer}>
        <Text style={styles.plansTitle}>Planos Disponíveis:</Text>
        <Text style={styles.planItem}>• Plano para comercios: R$ 35,00</Text>
        <Text style={styles.planItem}>• Plano Empresarial: R$ 120,00</Text>
        <Text style={styles.footerText}>Ao enviar seu comércio, iremos verificar o pagamento e, em seguida, publicá-lo para toda a nossa comunidade.</Text>
      </View>
        <TextInput
          style={styles.input}
          placeholder="Nome do Comércio"
          value={nome}
          onChangeText={setNome}
        />
        <Picker
          selectedValue={categoria}
          style={styles.picker}
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          <Picker.Item label="Selecione a Categoria" value="" />
          <Picker.Item label="Pizzaria" value="pizzaria" />
          <Picker.Item label="Lanchonete" value="lanchonete" />
          <Picker.Item label="Restaurante" value="restaurante" />
          <Picker.Item label="Igreja" value="igreja" />
          <Picker.Item label="Comércio" value="comercio" />
          <Picker.Item label="Ponto Turístico" value="ponto turistico" />
          <Picker.Item label="Sorveteria" value="sorveteria" />
          <Picker.Item label="Açaiteria" value="açaiteria" />
          <Picker.Item label="Shopping" value="shopping" />
          <Picker.Item label="Evento" value="evento" />
          <Picker.Item label="Cinema" value="cinema" />
        </Picker>
        <View style={styles.row}>
          <TextInput
            style={styles.inputHalf}
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
          <TextInput
            style={styles.inputHalf}
            placeholder="Estado"
            value={estado}
            onChangeText={setEstado}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
        />
        <TextInput
          style={styles.input}
          placeholder="Horário de Funcionamento"
          value={horarioFuncionamento}
          onChangeText={setHorarioFuncionamento}
        />
        <Icon
  name={favoritos.includes(item) ? "heart" : "heart-outline"}
  size={30}
  color={favoritos.includes(item) ? "red" : "#000"}
  onPress={() => toggleFavorito(item)}
/>

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TouchableOpacity onPress={enviarWhatsApp} style={styles.button}>
          <Text style={styles.buttonText}>Enviar via WhatsApp</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
const PoliticaDePrivacidadeScreen = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Política de Privacidade</Text>
  
        <Text style={styles.sectionTitle}>Introdução</Text>
        <Text style={styles.text}>
          Sua privacidade é importante para nós. Esta política de privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações.
        </Text>
  
        <Text style={styles.sectionTitle}>Aceitação</Text>
        <Text style={styles.text}>
          Ao usar nosso aplicativo, você concorda com a coleta e uso de informações de acordo com esta política.
        </Text>
  
        <Text style={styles.sectionTitle}>Informações que Coletamos</Text>
        <Text style={styles.text}>
          - Dados pessoais que você nos fornece, como nome, telefone, etc.
        </Text>
        <Text style={styles.text}>
          - Informações sobre seu uso do aplicativo, incluindo informações sobre seu dispositivo, localização e histórico de navegação.
        </Text>
        <Text style={styles.sectionTitle}>Como Usamos Suas Informações</Text>
        <Text style={styles.text}>
          - Para fornecer e manter nosso serviço.
        </Text>
        <Text style={styles.text}>
          - Para notificá-lo sobre alterações em nosso serviço.
        </Text>
        <Text style={styles.text}>
          - Para notificá-lo sobre alterações em nosso serviço.
        </Text>
        <Text style={styles.text}>
          - Para permitir que você participe de recursos interativos quando optar por fazê-lo.
        </Text>
        <Text style={styles.text}>
          - Para fornecer suporte ao cliente.
        </Text>
        <Text style={styles.text}>
          - Para reunir análises ou informações valiosas para que possamos melhorar nosso serviço.
        </Text>
        <Text style={styles.text}>
          - Para monitorar o uso do serviço.
        </Text>
        <Text style={styles.text}>
          - Para detectar, prevenir e resolver problemas técnicos.
        </Text>
  
        <Text style={styles.sectionTitle}>Segurança</Text>
        <Text style={styles.text}>
          A segurança de suas informações é importante para nós, mas lembre-se que nenhum método de transmissão pela Internet, ou método de armazenamento eletrônico é 100% seguro.
        </Text>
  
        <Text style={styles.sectionTitle}>Mudanças nesta Política de Privacidade</Text>
        <Text style={styles.text}>
          Podemos atualizar nossa política de privacidade de tempos em tempos. Notificaremos você sobre quaisquer mudanças publicando a nova política de privacidade neste aplicativo.
        </Text>
  
        <Text style={styles.sectionTitle}>Entre em Contato</Text>
        <Text style={styles.text}>
          Se você tiver alguma dúvida sobre esta política de privacidade, entre em contato por email: guilhermedevsistemas@gmail.com.
        </Text>
      </ScrollView>
    );
  };

  const FavoritosScreen = ({ navigation }) => {
    const [favoritos, setFavoritos] = useState([]);
  
    // Para pegar os favoritos do armazenamento local, você pode usar AsyncStorage.
    // Aqui estamos apenas mostrando um exemplo simples:
    useEffect(() => {
      // Substitua isso pela lógica para pegar os favoritos
      const favoritosSalvos = []; // Recupere os favoritos de onde você armazenou
      setFavoritos(favoritosSalvos);
    }, []);
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Meus Comercios Favoritos</Text>
        {favoritos.length === 0 ? (
          <Text>Nenhum favorito encontrado.</Text>
        ) : (
          favoritos.map(item => (
            <View key={item.id} style={styles.comercioItem}>
              <Text>{item.nome}</Text>
              {/* Adicione aqui mais detalhes do comércio, se desejar */}
            </View>
          ))
        )}
      </ScrollView>
    );
  };
  

  const ConfiguracoesScreen = () => {
    const [fontSize, setFontSize] = useState(16); // Tamanho padrão da fonte
    const [tema, setTema] = useState('claro'); // Tema padrão
  
    const toggleTema = () => {
      setTema(tema === 'claro' ? 'escuro' : 'claro');
    };
  
    return (
      <View style={[styles.container, tema === 'escuro' && styles.darkBackground]}>
        <Text style={[styles.title, { fontSize }]}>Configurações</Text>
        
        <Text style={[styles.label, { fontSize }]}>Tamanho da Fonte:</Text>
        <Picker
          selectedValue={fontSize}
          style={styles.picker}
          onValueChange={(itemValue) => setFontSize(itemValue)}
        >
          <Picker.Item label="Pequeno" value={12} />
          <Picker.Item label="Médio" value={16} />
          <Picker.Item label="Grande" value={20} />
        </Picker>
  
        <TouchableOpacity onPress={toggleTema} style={styles.button}>
          <Text style={styles.buttonText}>
            Mudar para Tema {tema === 'claro' ? 'Escuro' : 'Claro'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Cadastre seu Negócio" component={CadastroScreen} />
        <Drawer.Screen name="Política de Privacidade" component={PoliticaDePrivacidadeScreen} />
        <Drawer.Screen name="Configurações" component={ConfiguracoesScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  iconButton: {
    padding: 10,
    marginLeft: 30,
  },
  comercioItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  comercioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
    comercioDescricao: {
    fontSize: 14,
    color: '#555',
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
    backgroundColor: '#007BFF',
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
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056b3',
  },
});

export default App;
