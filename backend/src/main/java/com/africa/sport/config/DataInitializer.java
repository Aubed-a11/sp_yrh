package com.africa.sport.config;

import com.africa.sport.model.*;
import com.africa.sport.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SportTemplateRepository sportRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(SportTemplateRepository sportRepo,
                           UserRepository userRepo,
                           PasswordEncoder passwordEncoder) {
        this.sportRepo = sportRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initSports();
        initAdminUser();
    }

    private void initSports() {
        if (sportRepo.count() > 0) return;

        sportRepo.save(SportTemplate.builder().name("Football").icon("⚽")
            .description("Sport le plus populaire d'Afrique")
            .playerConfigurations("11v11,7v7,5v5,3v3").matchDuration("2x45min")
            .events("[\"BUT\",\"CARTON_JAUNE\",\"CARTON_ROUGE\",\"FAUTE\",\"CORNER\",\"REMPLACEMENT\",\"PENALTY\"]")
            .statistics("[\"buts\",\"passes_decisives\",\"tirs\",\"cartons_jaunes\",\"cartons_rouges\"]")
            .positions("[\"Gardien\",\"Défenseur\",\"Milieu\",\"Attaquant\"]")
            .terminology("{\"halftime\":\"Mi-temps\",\"overtime\":\"Prolongation\"}")
            .rules("{\"yellowCardLimit\":2,\"redCardExpulsion\":true}").active(true).build());

        sportRepo.save(SportTemplate.builder().name("Basketball").icon("🏀")
            .description("Basketball africain")
            .playerConfigurations("5v5,3v3").matchDuration("4x10min")
            .events("[\"PANIER_2PTS\",\"PANIER_3PTS\",\"LANCER_FRANC\",\"FAUTE\",\"TEMPS_MORT\",\"REMPLACEMENT\"]")
            .statistics("[\"points\",\"rebonds\",\"passes_decisives\",\"fautes\"]")
            .positions("[\"Meneur\",\"Arrière\",\"Ailier\",\"Pivot\"]")
            .terminology("{\"period\":\"Quart-temps\",\"overtime\":\"Prolongation\"}")
            .rules("{\"quarterDuration\":10,\"periods\":4,\"foulsLimit\":5}").active(true).build());

        sportRepo.save(SportTemplate.builder().name("Handball").icon("🤾")
            .playerConfigurations("7v7").matchDuration("2x30min")
            .events("[\"BUT\",\"ARRET\",\"CARTON\",\"EXCLUSION_TEMPORAIRE\",\"PENALTY_7M\",\"REMPLACEMENT\"]")
            .positions("[\"Gardien\",\"Ailier Gauche\",\"Ailier Droit\",\"Pivot\",\"Demi-centre\"]")
            .active(true).build());

        sportRepo.save(SportTemplate.builder().name("Volleyball").icon("🏐")
            .playerConfigurations("6v6").matchDuration("5 sets max")
            .events("[\"POINT\",\"ACE\",\"BLOC\",\"FAUTE\",\"SET_GAGNE\",\"TEMPS_MORT\",\"REMPLACEMENT\"]")
            .positions("[\"Passeur\",\"Central\",\"Attaquant\",\"Libéro\",\"Réceptionneur\"]")
            .active(true).build());

        sportRepo.save(SportTemplate.builder().name("Tennis").icon("🎾")
            .playerConfigurations("1v1,2v2").matchDuration("3 ou 5 sets")
            .events("[\"POINT\",\"ACE\",\"DOUBLE_FAUTE\",\"JEU_GAGNE\",\"SET_GAGNE\"]")
            .positions("[\"Simple\",\"Double\"]").active(true).build());

        System.out.println("✅ 5 sports initialisés");
    }

    private void initAdminUser() {
        if (userRepo.existsByEmail("admin@sportafrica.com")) return;

        userRepo.save(User.builder()
            .email("admin@sportafrica.com")
            .password(passwordEncoder.encode("Admin2026@"))
            .firstName("Platform").lastName("Admin")
            .role(Role.PLATFORM_ADMIN).active(true).build());

        System.out.println("✅ Admin: admin@sportafrica.com / Admin2026@");
    }
}
