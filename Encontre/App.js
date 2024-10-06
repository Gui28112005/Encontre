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

    useEffect(() => {
      const carregarAvaliacoes = async () => {
          try {
              const avaliacoesArmazenadas = await AsyncStorage.getItem('avaliacoes');
              if (avaliacoesArmazenadas) {
                  setAvaliacoes(JSON.parse(avaliacoesArmazenadas));
              }
          } catch (error) {
              console.error("Erro ao carregar as avaliações: ", error);
          }
      };
  
      carregarAvaliacoes();
  }, []);
  
  
    // Renderiza o indicador de carregamento
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
                <Image 
      source={require('./assets/logoencontre.png')} // Substitua pelo caminho da sua imagem
      style={{ width: 150, height: 250, marginVertical:-50, }} // Ajuste o tamanho conforme necessário
    />
          <Text style={styles.loadingText}>Seja Bem-Vindo!</Text>
          <Text style={styles.loadingText2}>Vamos encontar um lugar novo?</Text>
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



  const abrirMaps = (cidade) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${cidade}`;
    Linking.openURL(url).catch(err => console.error("Erro ao abrir Maps: ", err));
  };

const renderItem = (item) => {
    const iconName = categoryIcons[item.categoria] || "help";
    const isFavorito = favoritos.includes(item);
    const notaAtual = avaliacoes[item.id] || 0;

    const handleVerifiedPress = () => {
        Alert.alert(
            "Comércio Verificado pela equipe Encontre!",
            "O que isso significa? Significa que esse comércio passou pelos testes de qualidade, assim verificado que fornece excelente atendimento aos clientes e funcionários. Nossa verificação é feita por testes de qualidade e opiniões de clientes."
        );
    };

    const handleLinkPress = (link, name) => {
        if (link) {
            abrirLink(link);
        } else {
            Alert.alert(`O comerciante optou por não ter essa rede social.`, `Não há um link disponível para ${name}.`);
        }
    };

 

    return (
        <View style={styles.comercioItem} key={item.id}>
            <Image
                source={{ uri: item.imagem_capa || 'default-image.jpg' }}
                style={styles.image}
            />

            <View style={styles.comercioHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={iconName} size={40} color="#0056b3" style={styles.icon} />
                             <Text style={styles.comercioTitle}>{item.nome}</Text>
                             <Icon
    name="checkmark-circle"
    size={30}
    color="green"
    onPress={handleVerifiedPress} // Chama a função ao clicar
    style={{ marginLeft: 10 }}
/>
                </View>
  
<Modal
 transparent={true}
visible={modalVisible}
 >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Política de Privacidade</Text>
                        <Text style={styles.modalText}>
                            Ao continuar, você aceita nossa política de privacidade.
                        </Text>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setIsChecked(!isChecked)}
                        >
                            <View style={isChecked ? styles.checked : styles.unchecked}>
                                {isChecked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>li a politica e estou ciente dos dados coletados</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={aceitarPolitica} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>aceito</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
        <View style={styles.infoContainer}>
    <Text style={styles.quemSomosTitulo}>
        <Icon name="phone-portrait" size={18} color="black" style={{ transform: [{ rotate: '90deg' }] }} /> Contato
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
        <Icon name="alarm" size={18} color="black" /> Horário: {item.horario_funcionamento}
    </Text>
</View>


            <View style={styles.quemSomosContainer}>
            <Text style={styles.quemSomosTitulo}>
                    <Icon name="chatbubbles" size={18} color="black" style={{ transform: [{ rotate: '90deg' }] }} /> Bora Conhecer agente?
                </Text>
                <Text style={styles.quemSomosTexto}>{item.descricao}</Text>
            </View>
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
                    <Icon name="paper-plane" size={18} color="black" style={{ transform: [{ rotate: '90deg' }] }} /> Conheça nossas redes socias:                </Text>
                <View style={styles.linksContainer}>
                    <View style={styles.iconContainer}>
                        <Icon 
                            name="book" 
                            size={30} 
                            color="#000" 
                            onPress={() => handleLinkPress(item.link_cardapio, 'Cardápio')} 
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon 
                            name="logo-facebook" 
                            size={30} 
                            color="#3b5998" 
                            onPress={() => handleLinkPress(item.link_facebook, 'Facebook')} 
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon 
                            name="logo-instagram" 
                            size={30} 
                            color="#e1306c" 
                            onPress={() => handleLinkPress(item.link_instagram, 'Instagram')} 
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon 
                            name="logo-whatsapp" 
                            size={30} 
                            color="#25D366" 
                            onPress={() => abrirWhatsApp(item.telefone)} 
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon 
                            name="map" 
                            size={30} 
                            color="green" 
                            onPress={() => abrirMaps(item.cidade)} 
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
      style={{ width: 150, height: 250, marginVertical:-50, }} // Ajuste o tamanho conforme necessário
    />
    
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
      <View style={{ alignItems: 'center', width: '100%',}}>
    <TouchableOpacity 
        onPress={filtrarComercios} 
        style={styles.iconButton}
    >
        <Icon name="filter-circle" size={38} color="#0056b3" />
    </TouchableOpacity>
    <Text style={styles.filtrarTexto}>Filtrar</Text>
</View>

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
  
      const numeroWhatsApp = '5516994392545'; // Altere para o número desejado
      const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;
      Linking.openURL(url).catch(err => console.error("Erro ao abrir WhatsApp: ", err));
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
        <Image 
      source={require('./assets/logoencontre.png')} // Substitua pelo caminho da sua imagem
      style={{ width: 150, height: 250, marginVertical:-50, }} // Ajuste o tamanho conforme necessário
    />
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


        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TouchableOpacity onPress={enviarWhatsApp} style={styles.button}>
          <Text style={styles.buttonText}>Enviar via WhatsApp 📞</Text>
        </TouchableOpacity>
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
        </ScrollView>
    );
};
  

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Lar">
        <Drawer.Screen name="Encontre Feed" component={HomeScreen} />
        <Drawer.Screen name="Cadastre seu Negócio" component={CadastroScreen} />
        <Drawer.Screen name="Política de Privacidade" component={PoliticaDePrivacidadeScreen} />
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
    backgroundColor: '#f8f9fa',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
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
    padding: 10,
    backgroundColor: '#f0f0f0', // Cor de fundo leve para destacar
    borderRadius: 8,
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
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 15,
    marginBottom: 10,
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
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  quemSomosTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quemSomosTexto: {
    fontSize: 18,
    color: '#333',
  },
  quemSomosTexto: {
    fontSize: 16, // Ajuste o tamanho conforme necessário
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
  fontSize: 18, // Aumentei o tamanho do checkmark
},
checkboxLabel: {
  marginLeft: 12, // Aumentei o espaço à esquerda
  fontSize: 16, // Tamanho de fonte ajustado para melhor legibilidade
  color: '#333', // Cor mais escura
},
iconButton: {
  justifyContent: 'center',  // Garante que o conteúdo esteja centrado
  alignItems: 'center',      // Alinha itens no centro verticalmente
  padding: 0,               // Adiciona um pouco de espaço ao redor
},
filtrarTexto: {
  marginTop: 0,              // Espaçamento entre ícone e texto
  fontSize: 18,              // Tamanho da fonte
  color: '#0056b3',          // Cor do texto
  textAlign: 'center',       // Centraliza o texto
},

});

export default App;
