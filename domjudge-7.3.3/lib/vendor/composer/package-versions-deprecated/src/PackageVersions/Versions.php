<?php

declare(strict_types=1);

namespace PackageVersions;

use Composer\InstalledVersions;
use OutOfBoundsException;

class_exists(InstalledVersions::class);

/**
 * This class is generated by composer/package-versions-deprecated, specifically by
 * @see \PackageVersions\Installer
 *
 * This file is overwritten at every run of `composer install` or `composer update`.
 *
 * @deprecated in favor of the Composer\InstalledVersions class provided by Composer 2. Require composer-runtime-api:^2 to ensure it is present.
 */
final class Versions
{
    /**
     * @deprecated please use {@see self::rootPackageName()} instead.
     *             This constant will be removed in version 2.0.0.
     */
    const ROOT_PACKAGE_NAME = 'domjudge/domjudge';

    /**
     * Array of all available composer packages.
     * Dont read this array from your calling code, but use the \PackageVersions\Versions::getVersion() method instead.
     *
     * @var array<string, string>
     * @internal
     */
    const VERSIONS          = array (
  'angel-vladov/select2-theme-bootstrap4' => '0.2.0-beta.3@',
  'components/jquery' => '3.4.1@901828b7968b18319e377dc23d466f28426ee083',
  'composer/package-versions-deprecated' => '1.11.99.1@7413f0b55a051e89485c5cb9f765fe24bb02a7b6',
  'datatables/datatables' => '1.10.20@83657a29e33ce93ee940ce25684940eb3acb2913',
  'doctrine/annotations' => '1.10.2@b9d758e831c70751155c698c2f7df4665314a1cb',
  'doctrine/cache' => '1.10.0@382e7f4db9a12dc6c19431743a2b096041bcdd62',
  'doctrine/collections' => '1.6.4@6b1e4b2b66f6d6e49983cebfe23a21b7ccc5b0d7',
  'doctrine/common' => '2.12.0@2053eafdf60c2172ee1373d1b9289ba1db7f1fc6',
  'doctrine/data-fixtures' => '1.4.2@39e9777c9089351a468f780b01cffa3cb0a42907',
  'doctrine/dbal' => '2.10.2@aab745e7b6b2de3b47019da81e7225e14dcfdac8',
  'doctrine/doctrine-bundle' => '2.0.8@b0e0deb6e700438401ede433a15a6372d2285202',
  'doctrine/doctrine-cache-bundle' => '1.4.0@6bee2f9b339847e8a984427353670bad4e7bdccb',
  'doctrine/doctrine-fixtures-bundle' => '3.3.1@39defca57ee0949e1475c46177b30b6d1b732e8f',
  'doctrine/doctrine-migrations-bundle' => '2.1.2@856437e8de96a70233e1f0cc2352fc8dd15a899d',
  'doctrine/event-manager' => '1.1.0@629572819973f13486371cb611386eb17851e85c',
  'doctrine/inflector' => '1.3.1@ec3a55242203ffa6a4b27c58176da97ff0a7aec1',
  'doctrine/instantiator' => '1.3.0@ae466f726242e637cebdd526a7d991b9433bacf1',
  'doctrine/lexer' => '1.2.0@5242d66dbeb21a30dd8a3e66bf7a73b66e05e1f6',
  'doctrine/migrations' => '2.2.1@a3987131febeb0e9acb3c47ab0df0af004588934',
  'doctrine/orm' => '2.7.4@7d84a4998091ece4d645253ac65de9f879eeed2f',
  'doctrine/persistence' => '1.3.7@0af483f91bada1c9ded6c2cfd26ab7d5ab2094e0',
  'doctrine/reflection' => '1.2.1@55e71912dfcd824b2fdd16f2d9afe15684cfce79',
  'eligrey/filesaver' => '2.0.2@',
  'exsyst/swagger' => 'v0.4.1@a02984db5edacdce2b4e09dae5ba8fe17a0e449e',
  'fortawesome/font-awesome' => '5.9.0@',
  'friendsofsymfony/rest-bundle' => '2.7.4@3d8501dbdfa48811ef942f5f93c358c80d5ad8eb',
  'hoa/compiler' => '3.17.08.08@aa09caf0bf28adae6654ca6ee415ee2f522672de',
  'hoa/consistency' => '1.17.05.02@fd7d0adc82410507f332516faf655b6ed22e4c2f',
  'hoa/event' => '1.17.01.13@6c0060dced212ffa3af0e34bb46624f990b29c54',
  'hoa/exception' => '1.17.01.16@091727d46420a3d7468ef0595651488bfc3a458f',
  'hoa/file' => '1.17.07.11@35cb979b779bc54918d2f9a4e02ed6c7a1fa67ca',
  'hoa/iterator' => '2.17.01.10@d1120ba09cb4ccd049c86d10058ab94af245f0cc',
  'hoa/math' => '1.17.05.16@7150785d30f5d565704912116a462e9f5bc83a0c',
  'hoa/protocol' => '1.17.01.14@5c2cf972151c45f373230da170ea015deecf19e2',
  'hoa/regex' => '1.17.01.13@7e263a61b6fb45c1d03d8e5ef77668518abd5bec',
  'hoa/stream' => '1.17.02.21@3293cfffca2de10525df51436adf88a559151d82',
  'hoa/ustring' => '4.17.01.16@e6326e2739178799b1fe3fdd92029f9517fa17a0',
  'hoa/visitor' => '2.17.01.16@c18fe1cbac98ae449e0d56e87469103ba08f224a',
  'hoa/zformat' => '1.17.01.10@522c381a2a075d4b9dbb42eb4592dd09520e4ac2',
  'ircmaxell/password-compat' => 'v1.0.4@5c5cde8822a69545767f7c7f3058cb15ff84614c',
  'jdorn/sql-formatter' => 'v1.2.17@64990d96e0959dff8e059dfcdc1af130728d92bc',
  'jms/metadata' => '2.1.0@8d8958103485c2cbdd9a9684c3869312ebdaf73a',
  'jms/serializer' => '3.6.0@e82527ceddedf8dd988a4ce900f4b14fedf4d6f2',
  'jms/serializer-bundle' => '3.5.0@5793ec59b2243365a625c0fd78415732097c11e8',
  'mbostock/d3' => 'v3.5.17@9cc9a875e636a1dcf36cc1e07bdf77e1ad6e2c74',
  'monolog/monolog' => '1.25.3@fa82921994db851a8becaf3787a9e73c5976b6f1',
  'nelmio/api-doc-bundle' => 'v3.6.1@ab014fe032beb1a7875939ff4162e8d05ad778ab',
  'novus/nvd3' => 'v1.8.6@d273ea52d91b482d044f8cef1e921256f2bfddcd',
  'ocramius/proxy-manager' => '2.2.3@4d154742e31c35137d5374c998e8f86b54db2e2f',
  'phpdocumentor/reflection-common' => '2.0.0@63a995caa1ca9e5590304cd845c15ad6d482a62a',
  'phpdocumentor/reflection-docblock' => '5.1.0@cd72d394ca794d3466a3b2fc09d5a6c1dc86b47e',
  'phpdocumentor/type-resolver' => '1.1.0@7462d5f123dfc080dfdf26897032a6513644fc95',
  'psr/cache' => '1.0.1@d11b50ad223250cf17b86e38383413f5a6764bf8',
  'psr/container' => '1.0.0@b7ce3b176482dbbc1245ebf52b181af44c2cf55f',
  'psr/log' => '1.1.3@0f73288fd15629204f9d42b7055f72dacbe811fc',
  'sebastian/diff' => '3.0.0@e09160918c66281713f1c324c1f4c4c3037ba1e8',
  'select2/select2' => '4.0.13@45f2b83ceed5231afa7b3d5b12b58ad335edd82e',
  'sensio/framework-extra-bundle' => 'v5.5.4@d0585d4825a87a5030ca8cd34adb4a17e1066c17',
  'symfony/asset' => 'v4.4.7@e3574559efcb51601022fa46fd88dd13a8febdc2',
  'symfony/browser-kit' => 'v4.4.7@e4b0dc1b100bf75b5717c5b451397f230a618a42',
  'symfony/cache' => 'v4.4.7@f777b570291aebe51081b9827e05f3a747665e87',
  'symfony/cache-contracts' => 'v2.0.1@23ed8bfc1a4115feca942cb5f1aacdf3dcdf3c16',
  'symfony/config' => 'v4.4.7@3f4a3de1af498ed0ea653d4dc2317794144e6ca4',
  'symfony/console' => 'v4.4.7@10bb3ee3c97308869d53b3e3d03f6ac23ff985f7',
  'symfony/css-selector' => 'v4.4.7@afc26133a6fbdd4f8842e38893e0ee4685c7c94b',
  'symfony/debug' => 'v4.4.7@346636d2cae417992ecfd761979b2ab98b339a45',
  'symfony/dependency-injection' => 'v4.4.7@755b18859be26b90f4bf63753432d3387458bf31',
  'symfony/doctrine-bridge' => 'v4.4.7@7889c9df9fe4d95042c2f6e79901c9e6517343d9',
  'symfony/dom-crawler' => 'v4.4.7@4d0fb3374324071ecdd94898367a3fa4b5563162',
  'symfony/dotenv' => 'v4.4.7@a78e698cfb8aca8ef6814639eb5ffc17180a4326',
  'symfony/error-handler' => 'v4.4.7@7e9828fc98aa1cf27b422fe478a84f5b0abb7358',
  'symfony/event-dispatcher' => 'v4.4.7@abc8e3618bfdb55e44c8c6a00abd333f831bbfed',
  'symfony/event-dispatcher-contracts' => 'v1.1.7@c43ab685673fb6c8d84220c77897b1d6cdbe1d18',
  'symfony/expression-language' => 'v4.4.7@c4171e39e6cfc72e2bedb44922310d7d2bd2ab91',
  'symfony/filesystem' => 'v4.4.7@fe297193bf2e6866ed900ed2d5869362768df6a7',
  'symfony/finder' => 'v4.4.7@5729f943f9854c5781984ed4907bbb817735776b',
  'symfony/flex' => 'v1.9.10@7335ec033995aa34133e621627333368f260b626',
  'symfony/form' => 'v4.4.7@6dfd2d0f47b9a4abee73807f7172e2b8a0006571',
  'symfony/framework-bundle' => 'v4.4.7@80cdda836cfbe3ccb2bdd4a974f632473f0807a6',
  'symfony/http-client' => 'v4.4.7@9a8f5c968dc68d58044f8e9ff39d03074489b55d',
  'symfony/http-client-contracts' => 'v2.0.1@378868b61b85c5cac6822d4f84e26999c9f2e881',
  'symfony/http-foundation' => 'v4.4.7@62f92509c9abfd1f73e17b8cf1b72c0bdac6611b',
  'symfony/http-kernel' => 'v4.4.7@f356a489e51856b99908005eb7f2c51a1dfc95dc',
  'symfony/inflector' => 'v4.4.7@53cfa47fe9142f39b5605df67bada3893dd4f46c',
  'symfony/intl' => 'v4.4.7@63238a53b1cf0cd3e2b0b22cabc7c0b6f3fd4562',
  'symfony/mime' => 'v4.4.7@6dde9dc70155e91b850b1d009d1f841c54bc4aba',
  'symfony/monolog-bridge' => 'v4.4.7@2df4a774d99ae6e87c8b67891430f935312be412',
  'symfony/monolog-bundle' => 'v3.5.0@dd80460fcfe1fa2050a7103ad818e9d0686ce6fd',
  'symfony/options-resolver' => 'v4.4.7@9072131b5e6e21203db3249c7db26b52897bc73e',
  'symfony/polyfill-intl-icu' => 'v1.15.0@9c281272735eb66476e0fa7381e03fb0d4b60197',
  'symfony/polyfill-intl-idn' => 'v1.15.0@47bd6aa45beb1cd7c6a16b7d1810133b728bdfcf',
  'symfony/polyfill-mbstring' => 'v1.15.0@81ffd3a9c6d707be22e3012b827de1c9775fc5ac',
  'symfony/polyfill-php72' => 'v1.15.0@37b0976c78b94856543260ce09b460a7bc852747',
  'symfony/polyfill-php73' => 'v1.15.0@0f27e9f464ea3da33cbe7ca3bdf4eb66def9d0f7',
  'symfony/profiler-pack' => 'v1.0.4@99c4370632c2a59bb0444852f92140074ef02209',
  'symfony/property-access' => 'v4.4.7@75cbf0f388d82685ce06515951397bc1370901d7',
  'symfony/property-info' => 'v4.4.7@b6baecd501adec01a9d68f9c90b83659656065af',
  'symfony/routing' => 'v4.4.7@0f562fa613e288d7dbae6c63abbc9b33ed75a8f8',
  'symfony/security-bundle' => 'v4.4.7@1c317cd29a75e4806479241ffd31d8035e243420',
  'symfony/security-core' => 'v4.4.7@e99ad8bcd5d1202a1cff7b3e0e76d9077d81cbe6',
  'symfony/security-csrf' => 'v4.4.7@286a71ff176e1b0dd071f0e73dcec0970a56634b',
  'symfony/security-guard' => 'v4.4.7@606a741712d8adb49aee9b59d57010724db06797',
  'symfony/security-http' => 'v4.4.7@b413064160255c31077bb082d25b7bd89275971b',
  'symfony/service-contracts' => 'v2.0.1@144c5e51266b281231e947b51223ba14acf1a749',
  'symfony/stopwatch' => 'v4.4.7@e0324d3560e4128270e3f08617480d9233d81cfc',
  'symfony/translation-contracts' => 'v2.0.1@8cc682ac458d75557203b2f2f14b0b92e1c744ed',
  'symfony/twig-bridge' => 'v4.4.7@bef4da6724c5a89bb3408d3bc785be7cd5b9efed',
  'symfony/twig-bundle' => 'v4.4.7@44e3e82867bf4dcf52732dd7e0c83826f9da1095',
  'symfony/validator' => 'v4.4.7@2bf1de9d5cac5e5ebc159203c53dcf5b2058d340',
  'symfony/var-dumper' => 'v4.4.7@5a0c2d93006131a36cf6f767d10e2ca8333b0d4a',
  'symfony/var-exporter' => 'v4.4.7@6e4939b084defee0ab60a21e6a02e3a198afd91f',
  'symfony/web-profiler-bundle' => 'v4.4.7@4c432f5c21c700270819daacf95323302fa8f004',
  'symfony/yaml' => 'v4.4.7@ef166890d821518106da3560086bfcbeb4fadfec',
  'twbs/bootstrap' => 'v4.4.1@dca1ab7d877bc4b664b43604657a2b5fbe2b4ecb',
  'twig/extensions' => 'v1.5.4@57873c8b0c1be51caa47df2cdb824490beb16202',
  'twig/twig' => 'v2.12.5@18772e0190734944277ee97a02a9a6c6555fcd94',
  'webmozart/assert' => '1.8.0@ab2cb0b3b559010b75981b1bdce728da3ee90ad6',
  'willdurand/jsonp-callback-validator' => 'v1.1.0@1a7d388bb521959e612ef50c5c7b1691b097e909',
  'willdurand/negotiation' => 'v2.3.1@03436ededa67c6e83b9b12defac15384cb399dc9',
  'zendframework/zend-code' => '3.4.1@268040548f92c2bfcba164421c1add2ba43abaaa',
  'zendframework/zend-eventmanager' => '3.2.1@a5e2583a211f73604691586b8406ff7296a946dd',
  'zircote/swagger-php' => '2.0.15@5fd9439cfb76713925e23f206e9db4bf35784683',
  'myclabs/deep-copy' => '1.9.5@b2c28789e80a97badd14145fda39b545d83ca3ef',
  'nikic/php-parser' => 'v4.4.0@bd43ec7152eaaab3bd8c6d0aa95ceeb1df8ee120',
  'phar-io/manifest' => '1.0.3@7761fcacf03b4d4f16e7ccb606d4879ca431fcf4',
  'phar-io/version' => '2.0.1@45a2ec53a73c70ce41d55cedef9063630abaf1b6',
  'phpspec/prophecy' => 'v1.10.3@451c3cd1418cf640de218914901e51b064abb093',
  'phpunit/php-code-coverage' => '6.1.4@807e6013b00af69b6c5d9ceb4282d0393dbb9d8d',
  'phpunit/php-file-iterator' => '2.0.2@050bedf145a257b1ff02746c31894800e5122946',
  'phpunit/php-text-template' => '1.2.1@31f8b717e51d9a2afca6c9f046f5d69fc27c8686',
  'phpunit/php-timer' => '2.1.2@1038454804406b0b5f5f520358e78c1c2f71501e',
  'phpunit/php-token-stream' => '3.1.1@995192df77f63a59e47f025390d2d1fdf8f425ff',
  'phpunit/phpunit' => '7.5.20@9467db479d1b0487c99733bb1e7944d32deded2c',
  'sebastian/code-unit-reverse-lookup' => '1.0.1@4419fcdb5eabb9caa61a27c7a1db532a6b55dd18',
  'sebastian/comparator' => '3.0.2@5de4fc177adf9bce8df98d8d141a7559d7ccf6da',
  'sebastian/environment' => '4.2.3@464c90d7bdf5ad4e8a6aea15c091fec0603d4368',
  'sebastian/exporter' => '3.1.2@68609e1261d215ea5b21b7987539cbfbe156ec3e',
  'sebastian/global-state' => '2.0.0@e8ba02eed7bbbb9e59e43dedd3dddeff4a56b0c4',
  'sebastian/object-enumerator' => '3.0.3@7cfd9e65d11ffb5af41198476395774d4c8a84c5',
  'sebastian/object-reflector' => '1.1.1@773f97c67f28de00d397be301821b06708fca0be',
  'sebastian/recursion-context' => '3.0.0@5b0cd723502bac3b006cbf3dbf7a1e3fcefe4fa8',
  'sebastian/resource-operations' => '2.0.1@4d7a795d35b889bf80a0cc04e08d77cedfa917a9',
  'sebastian/version' => '2.0.1@99732be0ddb3361e16ad77b68ba41efc8e979019',
  'symfony/debug-bundle' => 'v4.4.7@dc847e4971b9f76b30e02d421b303d349d5aeed2',
  'symfony/maker-bundle' => 'v1.15.1@ae95a2b7fa8272e75630c273396097074f23e03f',
  'symfony/phpunit-bridge' => 'v4.4.7@6937c1a1590da7c314537b4f3f741c9255a7072e',
  'theseer/tokenizer' => '1.1.3@11336f6f84e16a720dae9d8e6ed5019efa85a0f9',
  'paragonie/random_compat' => '2.*@',
  'symfony/polyfill-ctype' => '*@',
  'symfony/polyfill-iconv' => '*@',
  'symfony/polyfill-php71' => '*@',
  'symfony/polyfill-php70' => '*@',
  'symfony/polyfill-php56' => '*@',
  'domjudge/domjudge' => 'No version set (parsed as 1.0.0)@',
);

    private function __construct()
    {
    }

    /**
     * @psalm-pure
     *
     * @psalm-suppress ImpureMethodCall we know that {@see InstalledVersions} interaction does not
     *                                  cause any side effects here.
     */
    public static function rootPackageName() : string
    {
        if (!class_exists(InstalledVersions::class, false) || !InstalledVersions::getRawData()) {
            return self::ROOT_PACKAGE_NAME;
        }

        return InstalledVersions::getRootPackage()['name'];
    }

    /**
     * @throws OutOfBoundsException If a version cannot be located.
     *
     * @psalm-param key-of<self::VERSIONS> $packageName
     * @psalm-pure
     *
     * @psalm-suppress ImpureMethodCall we know that {@see InstalledVersions} interaction does not
     *                                  cause any side effects here.
     */
    public static function getVersion(string $packageName): string
    {
        if (class_exists(InstalledVersions::class, false) && InstalledVersions::getRawData()) {
            return InstalledVersions::getPrettyVersion($packageName)
                . '@' . InstalledVersions::getReference($packageName);
        }

        if (isset(self::VERSIONS[$packageName])) {
            return self::VERSIONS[$packageName];
        }

        throw new OutOfBoundsException(
            'Required package "' . $packageName . '" is not installed: check your ./vendor/composer/installed.json and/or ./composer.lock files'
        );
    }
}
