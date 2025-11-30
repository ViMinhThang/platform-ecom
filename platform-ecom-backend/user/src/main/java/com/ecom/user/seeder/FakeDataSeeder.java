package com.ecom.user.seeder;

import com.ecom.user.entity.Address;
import com.ecom.user.entity.AppRole;
import com.ecom.user.entity.Role;
import com.ecom.user.entity.User;
import com.ecom.user.repositories.AddressRepository;
import com.ecom.user.repositories.RoleRepository;
import com.ecom.user.repositories.UserRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
public class FakeDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker();

    @Override
    @Transactional
    public void run(String... args) {
        // Check if data already exists
        if (userRepository.count() > 10) {
            log.info("Database already seeded with users. Skipping user seeding.");
            return;
        }

        log.info("Starting User service fake data seeding...");

        // Seed Roles
        seedRoles();

        // Seed Users with Addresses
        seedUsers(100);

        log.info("User service fake data seeding completed!");
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            log.info("Seeding roles...");
            Role userRole = new Role(AppRole.ROLE_USER);
            Role sellerRole = new Role(AppRole.ROLE_SELLER);
            Role adminRole = new Role(AppRole.ROLE_ADMIN);

            roleRepository.saveAll(List.of(userRole, sellerRole, adminRole));
            log.info("✓ Created 3 roles");
        }
    }

    private void seedUsers(int count) {
        log.info("Seeding {} users with addresses...", count);

        List<Role> allRoles = roleRepository.findAll();
        Role userRole = allRoles.stream()
                .filter(r -> r.getRoleName() == AppRole.ROLE_USER)
                .findFirst().orElse(null);
        Role sellerRole = allRoles.stream()
                .filter(r -> r.getRoleName() == AppRole.ROLE_SELLER)
                .findFirst().orElse(null);
        Role adminRole = allRoles.stream()
                .filter(r -> r.getRoleName() == AppRole.ROLE_ADMIN)
                .findFirst().orElse(null);

        List<User> users = new ArrayList<>();

        // Create admin user
        User admin = createUser("admin", "admin@ecom.com", "admin123", Set.of(adminRole, userRole,sellerRole));
        users.add(admin);

        // Create regular users
        for (int i = 0; i < count - 1; i++) {
            String username = faker.name().username() + i;
            String email = faker.internet().emailAddress();
            String password = "password123";

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);

            // 20% chance to be a seller
            if (faker.number().numberBetween(1, 100) <= 20) {
                roles.add(sellerRole);
            }

            User user =createUser(username, email, password, roles);
            users.add(user);
        }

        users = userRepository.saveAll(users);
        log.info("✓ Created {} users", users.size());

        // Add addresses to users
        seedAddresses(users);
    }

    private User createUser(String username, String email, String password, Set<Role> roles) {
        User user = new User();
        user.setUserName(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(roles);
        user.setIsActive("true");
        user.setImageUrl(faker.avatar().image());
        return user;
    }

    private void seedAddresses(List<User> users) {
        log.info("Seeding addresses for users...");

        List<Address> addresses = new ArrayList<>();
        for (User user : users) {
            int addressCount = faker.number().numberBetween(1, 4);
            for (int i = 0; i < addressCount; i++) {
                Address address = new Address();
                address.setStreet(faker.address().streetAddress());
                address.setBuildingName(faker.address().buildingNumber() + " " + faker.address().secondaryAddress());
                address.setCity(faker.address().city());
                address.setState(faker.address().state());
                address.setCountry(faker.address().country());
                address.setPincode(faker.address().zipCode());
                address.setUser(user);
                addresses.add(address);
            }
        }

        addressRepository.saveAll(addresses);
        log.info("✓ Created {} addresses", addresses.size());
    }
}
